// Runs in OhMyGame's extension host: checks the Fyrox toolchain, compiles and
// runs the project's game with cargo, and installs the missing dependencies.
import { spawn } from "node:child_process";
import { closeSync, existsSync, mkdtempSync, openSync, readFileSync, readdirSync, rmSync, statfsSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, isAbsolute, join } from "node:path";

const MAX_OUTPUT = 16000;
const RUN_LOG = "fyrox-run.log";
const EDITOR_LOG = "fyrox-editor.log";
const IS_WINDOWS = process.platform === "win32";

const CARGO_ENV = {
  ...process.env,
  CARGO_TERM_COLOR: "never",
  CARGO_TERM_PROGRESS_WHEN: "never",
};

function buildEnv(configuration) {
  const dir = String(configuration?.targetDir ?? "").trim();
  return dir ? { ...CARGO_ENV, CARGO_TARGET_DIR: dir } : CARGO_ENV;
}

function freeBytes(path) {
  let current = path;
  for (let depth = 0; depth < 8 && current; depth += 1) {
    try {
      const stats = statfsSync(current);
      return Number(stats.bavail) * Number(stats.bsize);
    } catch {
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  return null;
}

const INSTALLS = {
  clippy: { tool: "rustup", args: ["component", "add", "clippy"], restart: false },
  "project-manager": { tool: "cargo", args: ["install", "fyrox-project-manager"], restart: false },
  "rust-update": { tool: "rustup", args: ["update"], restart: false },
  "project-manager-update": {
    tool: "cargo",
    args: ["install", "fyrox-project-manager", "--force"],
    restart: false,
  },
};

function stripAnsi(text) {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\u001b\[[0-9;]*m/g, "");
}

function firstErrorLine(text) {
  return (
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => /^error(\[E\d+\])?:/.test(line))
      ?.slice(0, 400) ?? null
  );
}

function projectFolder(context) {
  const folder = context.project?.folder;
  if (!folder) {
    throw new Error("This plugin runs inside a project, and none is open.");
  }
  if (!existsSync(join(folder, "Cargo.toml"))) {
    throw new Error("Cargo.toml is missing: this project is not a Rust project.");
  }
  return folder;
}

function anyFolder(context) {
  return context.project?.folder ?? null;
}

// cargo and friends may be installed after OhMyGame started, so PATH alone is
// not enough: also look where rustup puts them.
function resolveTool(name) {
  const fileName = IS_WINDOWS ? `${name}.exe` : name;
  const dirs = String(process.env.PATH ?? "").split(delimiter).filter(Boolean);
  const home = process.env.USERPROFILE ?? process.env.HOME;
  const cargoHome = process.env.CARGO_HOME ?? (home ? join(home, ".cargo") : null);
  if (cargoHome) dirs.push(join(cargoHome, "bin"));
  for (const dir of dirs) {
    const candidate = join(dir, fileName);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function hintFor(output, code) {
  if (/link\.exe.{0,60}(?:not found|failed)|msvc linker|linking with .{0,20}link\.exe/i.test(output)) {
    return "missing_linker";
  }
  if (/no such command: `?clippy/i.test(output)) return "clippy_missing";
  if (
    /failed to (?:download|fetch)|couldn't resolve|could not resolve|network is unreachable|connection (?:refused|reset|timed out)|certificate (?:error|verify|problem)|tls error|proxy (?:error|authentication|connect)|registry index|offline mode/i.test(
      output,
    )
  ) {
    return "network";
  }
  if (code !== 0 || /^error(\[E\d+\])?:/m.test(output)) return "compile_errors";
  return null;
}

function prepareArgs(layout, operation, release) {
  if (layout === "workspace") {
    if (operation === "build") {
      return release ? ["build", "-p", "executor", "--release"] : ["build", "-p", "executor"];
    }
    if (operation === "clippy") {
      return ["clippy", "-p", "game", "-p", "executor", "--message-format=short"];
    }
    return ["check", "-p", "game", "-p", "executor", "--message-format=short"];
  }
  if (operation === "build") return release ? ["build", "--release"] : ["build"];
  if (operation === "clippy") return ["clippy", "--message-format=short"];
  return ["check", "--message-format=short"];
}

function readLayout(folder) {
  if (!folder) return "crate";
  try {
    const toml = readFileSync(join(folder, "Cargo.toml"), "utf8");
    if (
      /^\s*\[workspace\]/m.test(toml) &&
      existsSync(join(folder, "executor", "Cargo.toml")) &&
      existsSync(join(folder, "game", "Cargo.toml"))
    ) {
      return "workspace";
    }
  } catch {
    // not a cargo project yet
  }
  return "crate";
}

function spawnCapture(file, args, { cwd, signal, progress, env } = {}) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    let output = "";
    let pendingLine = "";
    let lastProgressAt = 0;
    let settled = false;

    const finish = (extra) => {
      if (settled) return;
      settled = true;
      const text = stripAnsi(output).trim();
      resolve({
        code: extra.code ?? null,
        seconds: Math.round((Date.now() - startedAt) / 100) / 10,
        output:
          text.length > MAX_OUTPUT
            ? `${text.slice(0, 4000)}\n…\n${text.slice(-(MAX_OUTPUT - 4000))}`
            : text,
        firstError: firstErrorLine(text),
        ...extra,
      });
    };

    const emit = (line) => {
      const trimmed = line.trim();
      if (!trimmed || !progress) return;
      const now = Date.now();
      if (now - lastProgressAt < 250) return;
      lastProgressAt = now;
      try {
        progress(trimmed.slice(0, 300));
      } catch {
        // progress is best effort
      }
    };

    let child;
    try {
      child = spawn(file, args, {
        cwd,
        env: env ?? CARGO_ENV,
        windowsHide: true,
      });
    } catch (error) {
      finish({ spawnError: String(error?.message ?? error) });
      return;
    }

    const onData = (chunk) => {
      output += chunk.toString();
      if (output.length > MAX_OUTPUT * 4) output = output.slice(-MAX_OUTPUT * 2);
      const lines = (pendingLine + chunk.toString()).split(/\r?\n/);
      pendingLine = lines.pop() ?? "";
      for (const line of lines) emit(line);
    };

    child.stdout?.on("data", onData);
    child.stderr?.on("data", onData);

    const stop = () => {
      try {
        child.kill();
      } catch {
        // already gone
      }
    };
    if (signal) {
      if (signal.aborted) stop();
      else signal.addEventListener("abort", stop, { once: true });
    }

    child.on("error", (error) =>
      finish({ spawnError: String(error?.message ?? error), code: null }),
    );
    child.on("close", (code, signalName) =>
      finish({ code, signal: signalName ?? null, aborted: Boolean(signal?.aborted) }),
    );
  });
}

function report(call, message) {
  try {
    call?.progress?.(message);
  } catch {
    // progress is best effort
  }
}

async function runCargo(folder, args, { signal, progress, env } = {}) {
  const cargo = resolveTool("cargo");
  if (!cargo) {
    return {
      ok: false,
      command: `cargo ${args.join(" ")}`,
      code: null,
      seconds: 0,
      output: "",
      firstError: null,
      hint: "cargo_missing",
      spawnError: "cargo was not found",
    };
  }
  const result = await spawnCapture(cargo, args, { cwd: folder, signal, progress, env });
  return {
    ok: result.code === 0 && !result.spawnError,
    command: `cargo ${args.join(" ")}`,
    hint: result.spawnError ? "cargo_missing" : hintFor(result.output, result.code),
    ...result,
  };
}

function readFyroxVersion(folder) {
  if (!folder) return null;
  try {
    const toml = readFileSync(join(folder, "Cargo.toml"), "utf8");
    const direct = toml.split(/\r?\n/).find((item) => /^\s*fyrox\s*=/.test(item));
    if (direct) return direct.match(/"([^"]+)"/)?.[1] ?? null;
    const workspace = toml.match(
      /\[workspace\.dependencies\.fyrox\][^[]*?version\s*=\s*"([^"]+)"/s,
    );
    return workspace?.[1] ?? null;
  } catch {
    return null;
  }
}

function readRustRequirement(folder) {
  if (!folder) return null;
  try {
    const toml = readFileSync(join(folder, "Cargo.toml"), "utf8");
    const line = toml.split(/\r?\n/).find((item) => /^\s*rust-version\s*=/.test(item));
    return line?.match(/"([^"]+)"/)?.[1] ?? null;
  } catch {
    return null;
  }
}

function parseVersion(text) {
  const match = String(text ?? "").match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] : null;
}

function versionAtLeast(installed, required) {
  if (!installed || !required) return true;
  for (let i = 0; i < 3; i += 1) {
    if (installed[i] !== required[i]) return installed[i] > required[i];
  }
  return true;
}

async function probeLinker(rustc, folder, { signal } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "fyrox-probe-"));
  try {
    const source = join(dir, "probe.rs");
    writeFileSync(source, 'fn main() { println!("ok"); }\n');
    const result = await spawnCapture(rustc, [source, "-o", join(dir, "probe-bin")], {
      cwd: folder ?? dir,
      signal,
    });
    if (result.code === 0) return { ok: true, reason: null, detail: null };
    const text = result.output;
    const reason = /link\.exe|msvc linker|linking with/i.test(text)
      ? "linker_missing"
      : "compile_failed";
    return { ok: false, reason, detail: firstErrorLine(text) ?? text.slice(-600) };
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // temp folder
    }
  }
}

function classifyExe(path) {
  const name = String(path ?? "").split(/[\\/]/).pop() ?? "";
  if (/project[-_ ]?manager/i.test(name)) return "project_manager";
  if (/fyroxed/i.test(name)) return "fyroxed";
  return "other";
}

function readSavedEditor(context) {
  if (!context.dataFolder) return null;
  try {
    const data = JSON.parse(readFileSync(join(context.dataFolder, "editor.json"), "utf8"));
    return typeof data?.path === "string" && data.path ? data.path : null;
  } catch {
    return null;
  }
}

function saveEditor(context, path) {
  if (!context.dataFolder) return false;
  try {
    writeFileSync(join(context.dataFolder, "editor.json"), JSON.stringify({ path }));
    return true;
  } catch {
    return false;
  }
}

// Fyroxed is portable, so it is looked for where downloads usually land.
async function findFyroxed(context, { broad = false, onProgress } = {}) {
  const home = process.env.USERPROFILE ?? process.env.HOME ?? "";
  const roots = [
    home ? join(home, "Downloads") : null,
    home ? join(home, "Desktop") : null,
    home ? join(home, "Documents") : null,
    anyFolder(context),
  ];
  if (broad) {
    for (const letter of ["C", "D", "E", "F", "G"]) {
      const drive = `${letter}:\\`;
      if (existsSync(drive)) roots.push(drive);
    }
    roots.push(process.env.ProgramFiles, process.env["ProgramFiles(x86)"]);
  }
  const found = [];
  const visitedLimit = broad ? 20000 : 4000;
  let visited = 0;

  const walk = async (dir, depth) => {
    if (depth > 3 || visited > visitedLimit) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      visited += 1;
      if (visited > visitedLimit) return;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          /^(node_modules|target|\.git|appdata|windows|programdata|\$recycle\.bin|system volume information|recovery|perflogs|config\.msi|msocache|\.rustup|\.cargo)$/i.test(
            entry.name,
          )
        ) {
          continue;
        }
        await walk(full, depth + 1);
      } else if (/^fyroxed[^\\/]*\.exe$/i.test(entry.name)) {
        try {
          const info = statSync(full);
          if (info.isFile()) found.push({ path: full, mtime: info.mtimeMs });
        } catch {
          // unreadable file
        }
      }
      if (visited % 500 === 0) await new Promise((resolve) => setImmediate(resolve));
    }
  };

  for (const root of roots.filter(Boolean)) {
    try {
      onProgress?.(root);
    } catch {
      // progress is best effort
    }
    await walk(root, 0);
  }
  found.sort((a, b) => b.mtime - a.mtime);
  return [...new Map(found.map((item) => [item.path.toLowerCase(), item.path])).values()].slice(0, 10);
}

function findProjectManager() {
  const cargo = resolveTool("fyrox-project-manager");
  return cargo
    ? { installed: true, path: cargo, source: "cargo" }
    : { installed: false, path: null, source: null };
}

async function checkEnvironment(context, { signal, configuration } = {}) {
  const folder = anyFolder(context);
  const layout = readLayout(folder);
  const integratedEditor =
    layout === "workspace" && Boolean(folder) && existsSync(join(folder, "editor", "Cargo.toml"));
  const cargo = resolveTool("cargo");
  const rustc = resolveTool("rustc");
  const rustup = resolveTool("rustup");

  const versionOf = async (file, args) => {
    if (!file) return null;
    const result = await spawnCapture(file, args, { cwd: folder ?? undefined, signal });
    if (result.code !== 0) return null;
    return stripAnsi(result.output).split(/\r?\n/)[0].trim();
  };

  const [rustcVersion, cargoVersion, toolchainVersion] = await Promise.all([
    versionOf(rustc, ["--version"]),
    versionOf(cargo, ["--version"]),
    versionOf(rustup, ["show", "active-toolchain"]),
  ]);

  const clippy = await (async () => {
    if (!cargo) return null;
    const result = await spawnCapture(cargo, ["clippy", "--version"], { signal });
    return result.code === 0;
  })();

  const linker = rustc
    ? await probeLinker(rustc, folder, { signal })
    : { ok: false, reason: "no_rust", detail: null };

  const requiredRust = readRustRequirement(folder);
  const versionOk = versionAtLeast(parseVersion(rustcVersion), parseVersion(requiredRust));
  const manager = findProjectManager();
  const savedEditor = readSavedEditor(context);
  const editorRaw = String(savedEditor ?? configuration?.fyroxedPath ?? "").trim();
  const editorPath = editorRaw
    ? isAbsolute(editorRaw)
      ? editorRaw
      : join(folder ?? "", editorRaw)
    : "";
  let editorExists = false;
  try {
    editorExists = Boolean(editorPath) && statSync(editorPath).isFile();
  } catch {
    editorExists = false;
  }
  const detected = integratedEditor || editorExists ? null : ((await findFyroxed(context))[0] ?? null);
  const editor = integratedEditor
    ? {
        integrated: true,
        configured: false,
        exists: true,
        path: null,
        kind: "integrated",
        source: "workspace",
        detected: null,
      }
    : editorPath
      ? {
          integrated: false,
          configured: true,
          exists: editorExists,
          path: editorPath,
          kind: classifyExe(editorPath),
          source: savedEditor ? "saved" : "settings",
          detected,
        }
      : {
          integrated: false,
          configured: false,
          exists: false,
          path: null,
          kind: null,
          source: null,
          detected,
        };
  const ready = Boolean(rustcVersion && cargoVersion && versionOk && linker.ok);
  const targetDir = String(configuration?.targetDir ?? "").trim() || null;
  const diskPath = targetDir || folder || process.cwd();
  const disk = { path: diskPath, freeBytes: freeBytes(diskPath) };

  return {
    platform: process.platform,
    isWindows: IS_WINDOWS,
    isMac: process.platform === "darwin",
    isLinux: process.platform === "linux",
    folder,
    layout,
    fyroxVersion: readFyroxVersion(folder),
    requiredRust,
    versionOk,
    manager,
    targetDir,
    disk,
    editor,
    rust: {
      installed: Boolean(cargo && rustc),
      cargo: cargoVersion,
      rustc: rustcVersion,
      toolchain: toolchainVersion,
      cargoPath: cargo,
      rustcPath: rustc,
    },
    rustup: Boolean(rustup),
    linker,
    clippy,
    ready,
    message: ready
      ? null
      : !rustcVersion || !cargoVersion
        ? "%ready.rust%"
        : !versionOk
          ? "%ready.rust_version%"
          : "%ready.linker%",
    missing: ready
      ? []
      : [
          ...(!rustcVersion || !cargoVersion ? ["rust"] : []),
          ...(!versionOk ? ["rust_version"] : []),
          ...(linker.ok ? [] : ["linker"]),
        ],
  };
}

export function activate(context) {
  let runningGame = null;
  let runningEditor = null;

  context.registerTool("fyrox_cargo", async (input, call) => {
    const folder = projectFolder(context);
    const layout = readLayout(folder);
    const operation =
      input?.operation === "build" || input?.operation === "clippy" ? input.operation : "check";
    const args = prepareArgs(layout, operation, Boolean(input?.release));
    report(call, `Running cargo ${args.join(" ")}…`);
    const result = await runCargo(folder, args, {
      signal: call?.signal,
      progress: (line) => report(call, line),
      env: buildEnv(call?.configuration),
    });
    report(call, result.ok ? `cargo ${operation} finished` : `cargo ${operation} failed`);
    return { operation, ...result };
  });

  context.registerCommand("fyroxCheck", async (input, call) => {
    const folder = projectFolder(context);
    const args = prepareArgs(readLayout(folder), "check", Boolean(input?.release));
    return runCargo(folder, args, {
      signal: call?.signal,
      progress: (line) => report(call, line),
      env: buildEnv(call?.configuration),
    });
  });

  context.registerCommand("fyroxDoctor", async (_input, call) => {
    report(call, "Checking the Fyrox toolchain…");
    return checkEnvironment(context, {
      signal: call?.signal,
      configuration: call?.configuration,
    });
  });

  context.registerCommand("fyroxFindEditor", async (_input, call) => {
    const found = await findFyroxed(context, {
      broad: true,
      onProgress: (root) => report(call, `Searching ${root}…`),
    });
    return { found };
  });

  context.registerCommand("fyroxSetEditor", async (input) => {
    if (input?.clear) {
      let cleared = false;
      try {
        if (context.dataFolder) {
          rmSync(join(context.dataFolder, "editor.json"), { force: true });
          cleared = true;
        }
      } catch {
        cleared = false;
      }
      return { cleared, saved: false };
    }
    const raw = String(input?.path ?? "").trim();
    if (!raw) {
      try {
        context.panels?.open("fyrox");
      } catch {
        // the panel opens only while a project is open
      }
      return {
        saved: false,
        error: "choose_in_panel",
        message: "Open the Fyrox panel and press Use this one on the Fyroxed row.",
      };
    }
    const full = isAbsolute(raw) ? raw : join(anyFolder(context) ?? "", raw);
    let isFile = false;
    try {
      isFile = statSync(full).isFile();
    } catch {
      isFile = false;
    }
    if (!isFile) return { saved: false, error: "not_a_file", path: full };
    if (classifyExe(full) === "project_manager") {
      return { saved: false, error: "project_manager", path: full };
    }
    const saved = saveEditor(context, full);
    return saved ? { saved: true, path: full } : { saved: false, error: "not_saved", path: full };
  });

  context.registerCommand("fyroxInstall", async (input, call) => {
    const dependency = String(input?.dependency ?? "");
    if (!dependency) {
      // Run from the Overview without a target: show the panel, where every
      // dependency is listed with its own Install button.
      try {
        context.panels?.open("fyrox");
      } catch {
        // the panel opens only while a project is open
      }
      return {
        installed: false,
        error: "choose_in_panel",
        message: "Open the Fyrox panel and press Install next to the dependency you want.",
      };
    }
    const plan = INSTALLS[dependency];
    if (!plan) {
      return { installed: false, error: "unknown_dependency", dependency };
    }
    const tool = resolveTool(plan.tool);
    if (!tool) {
      return { installed: false, error: `${plan.tool}_missing`, dependency };
    }

    report(call, `Installing ${dependency} with ${plan.tool}…`);
    const result = await spawnCapture(tool, plan.args, {
      signal: call?.signal,
      progress: (line) => report(call, line),
      env: buildEnv(call?.configuration),
    });
    report(call, result.code === 0 ? `${dependency} installed` : `${dependency} install failed`);
    return {
      installed: result.code === 0 && !result.spawnError,
      dependency,
      command: `${plan.tool} ${plan.args.join(" ")}`,
      restart: plan.restart,
      ...result,
    };
  });

  context.registerCommand("fyroxPlay", async (input, call) => {
    const folder = projectFolder(context);
    const layout = readLayout(folder);
    const playArgs = layout === "workspace" ? ["run", "-p", "executor"] : ["run"];
    const cargo = resolveTool("cargo");
    if (!cargo) {
      return { started: false, error: "cargo_missing", logFile: RUN_LOG };
    }
    if (runningGame && runningGame.exitCode === null) {
      return {
        started: false,
        error: "already_running",
        message: "The game is already running; close its window before starting it again.",
        logFile: RUN_LOG,
      };
    }

    // Fail in a second with the real reason instead of starting a long compile
    // that cannot link.
    const rustc = resolveTool("rustc");
    if (rustc) {
      const probe = await probeLinker(rustc, folder, {});
      if (!probe.ok) {
        return {
          started: false,
          error: probe.reason === "linker_missing" ? "missing_linker" : "link_failed",
          message: probe.detail ?? "The C linker is missing or failing.",
          logFile: RUN_LOG,
        };
      }
    }

    const logPath = join(folder, RUN_LOG);
    let fd;
    try {
      fd = openSync(logPath, "w");
    } catch (error) {
      return { started: false, error: "log_write_failed", message: String(error?.message ?? error) };
    }

    let child;
    let spawnError = null;
    try {
      child = spawn(cargo, playArgs, {
        cwd: folder,
        detached: true,
        windowsHide: true,
        stdio: ["ignore", fd, fd],
        env: buildEnv(call?.configuration),
      });
      child.once("error", (error) => {
        spawnError = String(error?.message ?? error);
      });
      await new Promise((resolve) => {
        const done = () => resolve();
        child.once("spawn", done);
        child.once("error", done);
        setTimeout(done, 3000);
      });
    } catch (error) {
      spawnError = String(error?.message ?? error);
    } finally {
      try {
        closeSync(fd);
      } catch {
        // handled by the child
      }
    }

    if (!child || spawnError) {
      return {
        started: false,
        error: "cargo_missing",
        message: spawnError ?? "cargo did not start",
        logFile: RUN_LOG,
      };
    }

    child.unref();
    runningGame = child;
    child.once("exit", () => {
      if (runningGame === child) runningGame = null;
    });
    report(call, "cargo run started; the game opens in its own window");
    return { started: true, command: "cargo run", logFile: RUN_LOG, pid: child.pid ?? null };
  });

  context.registerCommand("fyroxOpenEditor", async (input, call) => {
    const folder = projectFolder(context);
    if (readLayout(folder) !== "workspace" || !existsSync(join(folder, "editor", "Cargo.toml"))) {
      return {
        started: false,
        error: "no_integrated_editor",
        message: "This project has no editor crate; open the standalone Fyroxed instead.",
        logFile: EDITOR_LOG,
      };
    }
    if (runningEditor && runningEditor.exitCode === null) {
      return {
        started: false,
        error: "already_running",
        message: "The editor is already open.",
        logFile: EDITOR_LOG,
      };
    }
    const cargo = resolveTool("cargo");
    if (!cargo) return { started: false, error: "cargo_missing", logFile: EDITOR_LOG };

    const rustc = resolveTool("rustc");
    if (rustc) {
      const probe = await probeLinker(rustc, folder, {});
      if (!probe.ok) {
        return {
          started: false,
          error: probe.reason === "linker_missing" ? "missing_linker" : "link_failed",
          message: probe.detail ?? "The C linker is missing or failing.",
          logFile: EDITOR_LOG,
        };
      }
    }

    const logPath = join(folder, EDITOR_LOG);
    let fd;
    try {
      fd = openSync(logPath, "w");
    } catch (error) {
      return { started: false, error: "log_write_failed", message: String(error?.message ?? error) };
    }

    let child;
    let spawnError = null;
    try {
      child = spawn(cargo, ["run", "-p", "editor"], {
        cwd: folder,
        detached: true,
        windowsHide: true,
        stdio: ["ignore", fd, fd],
        env: buildEnv(call?.configuration),
      });
      child.once("error", (error) => {
        spawnError = String(error?.message ?? error);
      });
      await new Promise((resolve) => {
        const done = () => resolve();
        child.once("spawn", done);
        child.once("error", done);
        setTimeout(done, 3000);
      });
    } catch (error) {
      spawnError = String(error?.message ?? error);
    } finally {
      try {
        closeSync(fd);
      } catch {
        // handled by the child
      }
    }

    if (!child || spawnError) {
      return {
        started: false,
        error: "cargo_missing",
        message: spawnError ?? "cargo did not start",
        logFile: EDITOR_LOG,
      };
    }

    child.unref();
    runningEditor = child;
    child.once("exit", () => {
      if (runningEditor === child) runningEditor = null;
    });
    report(call, "cargo run -p editor started; the editor opens in its own window");
    return {
      started: true,
      command: "cargo run -p editor",
      logFile: EDITOR_LOG,
      pid: child.pid ?? null,
    };
  });
}
