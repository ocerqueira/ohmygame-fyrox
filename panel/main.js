// The Fyrox panel: project facts, toolchain dependencies with their install
// paths, and cargo check/run through the plugin's commands. Every action ends
// in a persistent result banner so it is obvious whether it worked.
import { connect } from "/_ohmygame/plugin-ui.js";

const host = await connect();
const isPt = String(host.locale ?? "en")
  .toLowerCase()
  .startsWith("pt");

const T = isPt
  ? {
      description: "Projeto de jogo em Rust com a engine Fyrox 1.0.",
      project: "Projeto",
      environment: "Ambiente",
      environmentDescription:
        "Essenciais para compilar e rodar; opcionais para editar e exportar.",
      environmentNote:
        "Instalar e atualizar aqui rodam só rustup/cargo. Para Rust e linker, use o instalador oficial ou copie o comando; reabra o OhMyGame depois. Só para editar cenas, o Fyroxed é portátil e não precisa de Rust.",
      buildDir: "Builds",
      buildDirDefault: "target/ (do projeto)",
      buildDirFree: "GB livres",
      buildDirLow: "pouco espaço",
      buildDirHint: "Defina outra pasta de build nas configurações do plugin.",
      gnuHeading: "Sem Build Tools? Use o toolchain GNU",
      gnuText:
        "O Windows pode linkar com o MinGW-w64 em vez do link.exe. O MSVC continua sendo o padrão mais testado; o GNU é Tier 1, mas tem menos mantenedores e alguns crates exigem o MinGW completo. O override abaixo vale só para este projeto.",
      gnuCopy: "Copiar comandos",
      msys2: "msys2.org",
      mingw: "MinGW-w64",
      verify: "Verificar",
      verifyPrompt: "Clique em Verificar para checar Rust, linker, Clippy e o resto.",
      verifying: "Verificando o ambiente…",
      essential: "Essencial",
      optional: "Opcional",
      ready: "pronto",
      notInstalled: "não instalado",
      notChecked: "não verificado",
      needsRust: "instale o Rust primeiro",
      editorHint: "portátil, sem instalação; abre data/scene.rgs",
      editorFound: "detectado",
      editorNotFound: "caminho não encontrado",
      editorOptional: "opcional",
      editorPortable: "portátil",
      editorDetected: "encontrado",
      useEditor: "Usar este",
      removeEditor: "Remover",
      projectManager: "project manager",
      wrongManager: "é o project manager, não o Fyroxed",
      editorCleared: "Caminho do Fyroxed removido",
      editorIntegrated: "integrado",
      openEditor: "Abrir editor",
      editorStarting: "Compilando o editor…",
      editorStartText:
        "cargo run -p editor: compilando; a janela do editor abre quando terminar.",
      editorOpened: "Editor aberto",
      editorOpenText: "O editor está aberto. Feche a janela para encerrar.",
      findEditor: "Procurar",
      searching: "Procurando o Fyroxed…",
      editorNoneFound:
        "Não encontrei o Fyroxed. Extraia o .exe em Downloads/Desktop/Documentos ou cole o caminho nas configurações do plugin.",
      saving: "Salvando…",
      editorSaved: "Fyroxed configurado",
      editorSaveFailed: "Não foi possível salvar o caminho do Fyroxed",
      viaCargo: "via cargo",
      install: "Instalar",
      update: "Atualizar",
      updateHeading: "Atualização",
      updating: "Atualizando…",
      updated: "Atualizado",
      updateFailed: "A atualização falhou",
      download: "Baixar",
      downloadPage: "Página de download",
      openingPage: "Abrindo a página…",
      copyCommand: "Copiar comando",
      copied: "Comando copiado",
      copyManual: "Copie o comando abaixo.",
      buildTools: "Build Tools (MSVC)",
      xcodeTools: "Xcode Command Line Tools",
      buildEssential: "build-essential",
      installing: "Instalando…",
      installOk: "Instalado",
      installFailed: "A instalação falhou",
      installLogEmpty: "Nada instalado ainda.",
      envCheckHeading: "Ambiente verificado",
      envReadyHeading: "Ambiente pronto",
      envMissingHeading: "Ambiente incompleto",
      setupIncomplete: "Antes de rodar",
      envCheckFailedHeading: "Não foi possível verificar o ambiente",
      blockedHeading: "O OhMyGame bloqueou a ação",
      blockedText:
        "Libere o código do plugin no Overview, em “Try its code”, e tente de novo.",
      busyHeading: "O agente está trabalhando",
      busyText: "Aguarde a tarefa atual terminar e tente de novo.",
      installHeading: "Instalação",
      actionFailed: "A ação falhou",
      build: "Compilar e jogar",
      buildDescription: "O jogo abre numa janela própria; o preview do OhMyGame não mostra ele.",
      docs: "Documentação",
      docsDescription: "O manual cobre o editor, os scripts e a exportação.",
      engine: "Engine",
      scene: "Cena inicial",
      entry: "Entrada do jogo",
      engineMissing: "fyrox não está no Cargo.toml",
      sceneMissing: "nenhuma cena .rgs em data/",
      entryMissing: "src/main.rs não encontrado",
      check: "Checar",
      play: "Rodar jogo",
      readyState: "Ainda não rodou",
      noResult: "Sem resposta",
      checking: "Checando…",
      starting: "Iniciando…",
      compiling: "Compilando…",
      compilingFirst: "Compilando (a primeira vez demora)…",
      ok: "Compilou",
      failed: "Falhou",
      running: "Jogo iniciado",
      logEmpty: "Compile com Checar para ver a saída do cargo.",
      checkStartText:
        "cargo check: a primeira vez baixa e compila as dependências; pode levar vários minutos.",
      runStartText:
        "cargo run está compilando; o jogo abre numa janela própria. Acompanhe abaixo.",
      runOpenText: "O jogo está aberto. Feche a janela para encerrar.",
      networkError: "Falha de rede",
      graphicsFailed: "A janela não abriu",
      gameCrashed: "O jogo quebrou",
      alreadyRunning: "O jogo já está aberto",
      alreadyRunningText: "Feche a janela do jogo antes de rodar de novo.",
      openGameLog: "Ver game.log",
      noGameLog: "O game.log ainda não existe.",
      linkerMissing: "Falta o linker",
      rustOld: "Rust desatualizado",
      rustOldHint: "O projeto exige uma versão mais nova. Rode: rustup update stable",
      compileErrors: "Erros de compilação",
      cargoMissing: "Falta o Rust (cargo)",
      linterMissing: "Falta o Clippy",
      genericFailure: "A ação falhou. Veja a saída abaixo.",
      openInstaller: "Abrir instalador",
      seeEnvironment: "Ver Ambiente",
      book: "Manual do Fyrox",
      api: "API 1.0.1",
      depRust: "Rust (cargo + rustc)",
      depLinker: "Linker C++",
      depClippy: "Clippy (linter)",
      depEditor: "Fyroxed (editor de cena)",
      depManager: "Fyrox project manager",
      installCargo: "Instalar (cargo)",
      hints: {
        cargo_missing:
          "O cargo não foi encontrado. Instale o Rust pelo rustup.rs e abra o OhMyGame de novo.",
        missing_linker:
          "O compilador não conseguiu linkar com o link.exe do Visual Studio. Instale o Visual Studio Build Tools com a carga “Desenvolvimento para desktop com C++” e clique em Checar de novo.",
        missing_linker_unix:
          "Faltam as ferramentas de compilação C. No macOS rode xcode-select --install; no Linux instale build-essential e pkg-config.",
        clippy_missing: "O Clippy não está instalado. Rode: rustup component add clippy",
        compile_errors:
          "O compilador encontrou erros. Leia o log, ajuste src/ e cheque de novo — ou peça ao agente para corrigir.",
        network:
          "O cargo não conseguiu acessar o crates.io. Verifique internet, proxy e certificados; depois clique em Checar de novo.",
        graphics:
          "O jogo compilou, mas não criou a janela. Verifique driver de vídeo/OpenGL 3.3+; em VM ou área remota, habilite aceleração gráfica. Veja o game.log.",
        panic:
          "O jogo iniciou e falhou. Veja o game.log; para o backtrace, rode com RUST_BACKTRACE=1.",
      },
    }
  : {
      description: "A Rust game project with the Fyrox 1.0 engine.",
      project: "Project",
      environment: "Environment",
      environmentDescription: "Essentials to build and run; optionals to edit and export.",
      environmentNote:
        "Install and update here only run rustup/cargo. Rust and the linker use the official installer or a copied command; reopen OhMyGame afterwards. To edit scenes only, Fyroxed is portable and needs no Rust.",
      buildDir: "Builds",
      buildDirDefault: "target/ (project)",
      buildDirFree: "GB free",
      buildDirLow: "low space",
      buildDirHint: "Set another build folder in the plugin settings.",
      gnuHeading: "No Build Tools? Use the GNU toolchain",
      gnuText:
        "Windows can link with MinGW-w64 instead of link.exe. MSVC is still the best-tested default; GNU is Tier 1, but it has fewer maintainers and some crates need a full MinGW install. The override below applies to this project only.",
      gnuCopy: "Copy commands",
      msys2: "msys2.org",
      mingw: "MinGW-w64",
      verify: "Verify",
      verifyPrompt: "Press Verify to check Rust, the linker, Clippy and the rest.",
      verifying: "Checking the environment…",
      essential: "Essential",
      optional: "Optional",
      ready: "ready",
      notInstalled: "not installed",
      notChecked: "not checked",
      needsRust: "install Rust first",
      editorHint: "portable, no installation; opens data/scene.rgs",
      editorFound: "found",
      editorNotFound: "path not found",
      editorOptional: "optional",
      editorPortable: "portable",
      editorDetected: "found automatically",
      useEditor: "Use this one",
      removeEditor: "Remove",
      projectManager: "project manager",
      wrongManager: "this is the project manager, not Fyroxed",
      editorCleared: "Fyroxed path removed",
      editorIntegrated: "integrated",
      openEditor: "Open editor",
      editorStarting: "Building the editor…",
      editorStartText: "cargo run -p editor: building; the editor window opens when it is done.",
      editorOpened: "Editor opened",
      editorOpenText: "The editor is open. Close its window to stop it.",
      findEditor: "Search",
      searching: "Searching for Fyroxed…",
      editorNoneFound:
        "Fyroxed was not found. Extract the .exe into Downloads/Desktop/Documents or paste its path in the plugin settings.",
      saving: "Saving…",
      editorSaved: "Fyroxed configured",
      editorSaveFailed: "The Fyroxed path could not be saved",
      viaCargo: "via cargo",
      install: "Install",
      update: "Update",
      updateHeading: "Update",
      updating: "Updating…",
      updated: "Updated",
      updateFailed: "Update failed",
      download: "Download",
      downloadPage: "Download page",
      openingPage: "Opening the page…",
      copyCommand: "Copy command",
      copied: "Command copied",
      copyManual: "Copy the command below.",
      buildTools: "Build Tools (MSVC)",
      xcodeTools: "Xcode Command Line Tools",
      buildEssential: "build-essential",
      installing: "Installing…",
      installOk: "Installed",
      installFailed: "Installation failed",
      installLogEmpty: "Nothing installed yet.",
      envCheckHeading: "Environment checked",
      envReadyHeading: "Environment ready",
      envMissingHeading: "Environment incomplete",
      setupIncomplete: "Before you run",
      envCheckFailedHeading: "The environment could not be checked",
      blockedHeading: "OhMyGame blocked the action",
      blockedText: "Allow this plugin's code in the Overview, under “Try its code”, then try again.",
      busyHeading: "The agent is working",
      busyText: "Wait for the current task to finish, then try again.",
      installHeading: "Installation",
      actionFailed: "The action failed",
      build: "Build and play",
      buildDescription: "The game opens in its own window, not in the OhMyGame preview.",
      docs: "Documentation",
      docsDescription: "The book covers the editor, scripts and export.",
      engine: "Engine",
      scene: "Scene",
      entry: "Game entry",
      engineMissing: "fyrox is not in Cargo.toml",
      sceneMissing: "no .rgs scene in data/",
      entryMissing: "src/main.rs not found",
      check: "Check",
      play: "Run game",
      readyState: "Not run yet",
      noResult: "No result",
      checking: "Checking…",
      starting: "Starting…",
      compiling: "Compiling…",
      compilingFirst: "Compiling (the first time is slow)…",
      ok: "Compiled",
      failed: "Failed",
      running: "Game started",
      logEmpty: "Press Check to see the cargo output.",
      checkStartText:
        "cargo check: the first time it downloads and builds the dependencies; this can take several minutes.",
      runStartText: "cargo run is compiling; the game opens in its own window. Watch below.",
      runOpenText: "The game is open. Close its window to stop it.",
      networkError: "Network problem",
      graphicsFailed: "The window did not open",
      gameCrashed: "The game crashed",
      alreadyRunning: "The game is already open",
      alreadyRunningText: "Close the game window before starting it again.",
      openGameLog: "See game.log",
      noGameLog: "game.log does not exist yet.",
      linkerMissing: "The linker is missing",
      rustOld: "Rust is out of date",
      rustOldHint: "The project needs a newer Rust. Run: rustup update stable",
      compileErrors: "Compilation errors",
      cargoMissing: "Rust (cargo) is missing",
      linterMissing: "Clippy is missing",
      genericFailure: "The action failed. See the output below.",
      openInstaller: "Open installer",
      seeEnvironment: "See Environment",
      book: "Fyrox book",
      api: "API 1.0.1",
      depRust: "Rust (cargo + rustc)",
      depLinker: "C++ linker",
      depClippy: "Clippy (linter)",
      depEditor: "Fyroxed (scene editor)",
      depManager: "Fyrox project manager",
      installCargo: "Install (cargo)",
      hints: {
        cargo_missing: "cargo was not found. Install Rust from rustup.rs and reopen OhMyGame.",
        missing_linker:
          "The Rust toolchain could not link with the Visual Studio linker (link.exe). Install the Visual Studio Build Tools with the “Desktop development with C++” workload, then press Check again.",
        missing_linker_unix:
          "The C build tools are missing. On macOS run xcode-select --install; on Linux install build-essential and pkg-config.",
        clippy_missing: "Clippy is not installed. Run: rustup component add clippy",
        compile_errors:
          "The compiler reported errors. Read the log, change src/ and check again — or ask the agent to fix them.",
        network:
          "cargo could not reach crates.io. Check the network, proxy and certificates, then press Check again.",
        graphics:
          "The game built but did not create a window. Check the video driver/OpenGL 3.3+; in a VM or remote desktop enable graphics acceleration. See game.log.",
        panic: "The game started and failed. See game.log; run with RUST_BACKTRACE=1 for a backtrace.",
      },
    };

const LINKS = {
  rust: "https://rustup.rs",
  linker: "https://visualstudio.microsoft.com/visual-cpp-build-tools/",
  editor: "https://fyrox.rs/download.html",
  book: "https://fyrox-book.github.io/",
  api: "https://docs.rs/fyrox/1.0.1/fyrox/",
  msys2: "https://www.msys2.org/",
};

const $ = (id) => document.getElementById(id);
const pageEl = $("page");
const logEl = $("log");
const installLogEl = $("install-log");
const stateEl = $("state");
const buildResultEl = $("build-result");
const buildResultTextEl = $("build-result-text");
const buildResultActionEl = $("build-result-action");
const envResultEl = $("env-result");
const envResultTextEl = $("env-result-text");
const checkBtn = $("check");
const playBtn = $("play");
const doctorBtn = $("doctor");

const platform = detectPlatform();
let environment = null;
let buildAction = null;
let logLines = [];
let installLines = [];
let setupWarningShown = false;

function detectPlatform() {
  const ua = String(navigator.userAgent ?? "");
  const p = String(navigator.platform ?? "");
  return {
    isWindows: /Win/i.test(p) || /Windows/i.test(ua),
    isMac: /Mac/i.test(p) || /Mac OS X/i.test(ua),
    isLinux: /Linux/i.test(ua) && !/Android/i.test(ua),
  };
}

function applyStrings() {
  pageEl.setAttribute("heading", "Fyrox");
  pageEl.setAttribute("description", T.description);
  $("project-section").setAttribute("heading", T.project);
  $("env-section").setAttribute("heading", T.environment);
  $("env-section").setAttribute("description", T.environmentDescription);
  $("env-note").textContent = T.environmentNote;
  $("build-dir").textContent = "";
  $("gnu-alternative").setAttribute("heading", T.gnuHeading);
  $("gnu-text").textContent = T.gnuText;
  $("copy-gnu").textContent = T.gnuCopy;
  $("link-msys2").textContent = T.msys2;
  doctorBtn.textContent = T.verify;
  $("build-section").setAttribute("heading", T.build);
  $("build-section").setAttribute("description", T.buildDescription);
  $("docs-section").setAttribute("heading", T.docs);
  $("docs-section").setAttribute("description", T.docsDescription);
  $("fact-engine").setAttribute("heading", T.engine);
  $("fact-scene").setAttribute("heading", T.scene);
  $("fact-entry").setAttribute("heading", T.entry);
  $("dep-rust").setAttribute("heading", T.depRust);
  $("dep-linker").setAttribute("heading", T.depLinker);
  $("dep-clippy").setAttribute("heading", T.depClippy);
  $("dep-editor").setAttribute("heading", T.depEditor);
  $("dep-manager").setAttribute("heading", T.depManager);
  $("install-clippy").textContent = T.install;
  $("install-manager").textContent = T.installCargo;
  for (const id of ["update-rust", "update-clippy", "update-manager"]) {
    $(id).textContent = T.update;
  }
  $("download-rust").textContent = "rustup.rs";
  $("download-linker").textContent = "visualstudio.com";
  $("download-editor").textContent = T.downloadPage;
  $("use-editor").textContent = T.useEditor;
  $("open-editor").textContent = T.openEditor;
  $("clear-editor").textContent = T.removeEditor;
  $("find-editor").textContent = T.findEditor;
  $("copy-rust").textContent = T.copyCommand;
  $("copy-linker").textContent = T.copyCommand;
  checkBtn.textContent = T.check;
  playBtn.textContent = T.play;
  logEl.setAttribute("empty", T.logEmpty);
  installLogEl.setAttribute("empty", T.installLogEmpty);
  $("book").textContent = T.book;
  $("api").textContent = T.api;
  $("download-linker").style.display = platform.isWindows ? "" : "none";
  $("copy-rust").style.display = "";
  $("copy-linker").style.display = "";
  setState("neutral", T.readyState);
  setDep("rust", "neutral", T.notChecked, `${T.essential} · ${T.notChecked}`);
  setDep("linker", "neutral", T.notChecked, `${T.essential} · ${T.notChecked}`);
  setDep("clippy", "neutral", T.notChecked, `${T.optional} · ${T.notChecked}`);
  setDep("editor", "neutral", null, `${T.optional} · ${T.editorHint}`);
  setDep("manager", "neutral", null, `${T.optional} · ${T.notChecked}`);
  $("status-editor").style.display = "none";
  $("status-manager").style.display = "none";
}

function setState(tone, text) {
  stateEl.setAttribute("tone", tone);
  stateEl.textContent = text;
}

function setDep(key, tone, state, description) {
  const status = $(`status-${key}`);
  if (status) {
    status.setAttribute("tone", tone);
    if (state) status.textContent = state;
  }
  $(`dep-${key}`).setAttribute("description", description);
}

function showBuildResult({ tone, heading, text, actionLabel, action }) {
  setupWarningShown = false;
  buildResultEl.setAttribute("tone", tone);
  buildResultEl.setAttribute("heading", heading);
  buildResultTextEl.textContent = text ?? "";
  buildAction = typeof action === "function" ? action : null;
  buildResultActionEl.textContent = actionLabel ?? "";
  buildResultActionEl.style.display = buildAction ? "" : "none";
  buildResultEl.style.display = "";
}

function hideBuildResult() {
  buildAction = null;
  buildResultEl.style.display = "none";
}

function showEnvResult(tone, heading, text) {
  envResultEl.setAttribute("tone", tone);
  envResultEl.setAttribute("heading", heading);
  envResultTextEl.textContent = text ?? "";
  envResultEl.style.display = "";
}

buildResultActionEl.addEventListener("click", () => {
  if (buildAction) buildAction();
});

function renderLog(lines) {
  logLines = lines.slice(-300);
  logEl.text = logLines.join("\n");
}

function appendLog(line) {
  if (!line) return;
  const next = line.split(/\r?\n/).filter((item) => item.trim().length > 0);
  renderLog(logLines.concat(next));
}

function renderInstallLog(line) {
  installLogEl.style.display = "";
  const next = String(line ?? "")
    .split(/\r?\n/)
    .filter((item) => item.trim().length > 0);
  installLines = installLines.concat(next).slice(-120);
  installLogEl.text = installLines.join("\n");
}

function looksBlocked(error) {
  return /not allowed|not permitted|permission|forbidden|blocked|try its code|setup-sessions|409|403|liberad|recusad/i.test(
    String(error ?? ""),
  );
}

function isBusy(error) {
  return /wait for the agent|agent to finish|being published|already being|busy|em andamento|aguarde/i.test(
    String(error ?? ""),
  );
}

function actionError(error, fallbackHeading) {
  if (isBusy(error)) return { heading: T.busyHeading, text: T.busyText };
  if (looksBlocked(error)) return { heading: T.blockedHeading, text: T.blockedText };
  return { heading: fallbackHeading, text: shortError(error) };
}

function shortError(error) {
  return String(error ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" ")
    .slice(0, 300);
}

function scrollToEnvironment() {
  $("env-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

function hintForBuild(kind) {
  const unix = !platform.isWindows;
  switch (kind) {
    case "missing_linker":
      return {
        heading: T.linkerMissing,
        text: unix ? T.hints.missing_linker_unix : T.hints.missing_linker,
        actionLabel: platform.isWindows ? T.openInstaller : T.seeEnvironment,
        action: platform.isWindows ? () => openLink(LINKS.linker) : scrollToEnvironment,
      };
    case "compile_errors":
      return {
        heading: T.compileErrors,
        text: T.hints.compile_errors,
        actionLabel: null,
        action: null,
      };
    case "network":
      return {
        heading: T.networkError,
        text: T.hints.network,
        actionLabel: null,
        action: null,
      };
    case "graphics":
      return {
        heading: T.graphicsFailed,
        text: T.hints.graphics,
        actionLabel: T.openGameLog,
        action: showGameLog,
      };
    case "panic":
      return {
        heading: T.gameCrashed,
        text: T.hints.panic,
        actionLabel: T.openGameLog,
        action: showGameLog,
      };
    case "already_running":
      return {
        heading: T.alreadyRunning,
        text: T.alreadyRunningText,
        actionLabel: null,
        action: null,
      };
    case "cargo_missing":
      return {
        heading: T.cargoMissing,
        text: T.hints.cargo_missing,
        actionLabel: "rustup.rs",
        action: () => openLink(LINKS.rust),
      };
    case "clippy_missing":
      return {
        heading: T.linterMissing,
        text: T.hints.clippy_missing,
        actionLabel: T.seeEnvironment,
        action: scrollToEnvironment,
      };
    default:
      return {
        heading: T.actionFailed,
        text: T.genericFailure,
        actionLabel: T.seeEnvironment,
        action: scrollToEnvironment,
      };
  }
}

function parseResult(event) {
  let result = event.detail?.result;
  if (typeof result === "string") {
    try {
      result = JSON.parse(result);
    } catch {
      result = { output: result };
    }
  }
  return result ?? {};
}

async function openLink(url) {
  try {
    await host.request("browser.open", { url });
  } catch {
    await host.request("ui.toast", { message: url, tone: "default" });
  }
}

async function toast(message, tone = "default") {
  try {
    await host.request("ui.toast", { message, tone });
  } catch {
    // a toast is best effort
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fall through to the selection trick
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  } catch {
    return false;
  }
}

async function copyCommand(command) {
  renderInstallLog(command);
  const copied = await copyText(command);
  toast(copied ? T.copied : T.copyManual, copied ? "success" : "default");
  if (!copied) installLogEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function openPage(url) {
  toast(T.openingPage);
  await openLink(url);
}

async function showGameLog() {
  try {
    const text = String(await host.files.text("game.log"));
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    renderLog(lines.slice(-250));
    toast(T.openGameLog, "default");
  } catch {
    toast(T.noGameLog, "default");
  }
}

function isGnu(env) {
  return /gnu/i.test(String(env?.rust?.toolchain ?? ""));
}

function gnuCommands() {
  return [
    "winget install --id MSYS2.MSYS2 -e",
    "rem In the MSYS2 MinGW64 shell: pacman -S --needed mingw-w64-x86_64-toolchain",
    "rustup toolchain install stable-x86_64-pc-windows-gnu",
    "rustup override set stable-x86_64-pc-windows-gnu",
  ].join("\n");
}

function rustCommand(env) {
  return env?.isWindows
    ? "winget install --id Rustlang.Rustup -e"
    : "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh";
}

function linkerCommand(env) {
  if (env?.isWindows && isGnu(environment)) {
    return "pacman -S --needed mingw-w64-x86_64-toolchain";
  }
  if (env?.isWindows) {
    return 'winget install --id Microsoft.VisualStudio.2022.BuildTools -e --override "--wait --quiet --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"';
  }
  if (env?.isMac) return "xcode-select --install";
  return "sudo apt install build-essential pkg-config libasound2-dev libudev-dev";
}

function platformTool(env) {
  if (!env) return "";
  if (env.isWindows) return isGnu(environment) ? T.mingw : T.buildTools;
  if (env.isMac) return T.xcodeTools;
  return T.buildEssential;
}

async function loadInfo() {
  let toml = "";
  try {
    toml = await host.files.text("Cargo.toml");
  } catch {
    toml = "";
  }
  const direct = toml.split(/\r?\n/).find((line) => /^\s*fyrox\s*=/.test(line));
  const workspace = toml.match(/\[workspace\.dependencies\.fyrox\][^[]*?version\s*=\s*"([^"]+)"/s);
  const version = direct?.match(/"([^"]+)"/)?.[1] ?? workspace?.[1] ?? null;
  $("fact-engine").setAttribute(
    "description",
    version ? `fyrox ${version}` : T.engineMissing,
  );

  let scenes = [];
  try {
    const { entries } = await host.files.list("data");
    scenes = entries
      .filter((entry) => entry.kind === "file" && entry.path.toLowerCase().endsWith(".rgs"))
      .map((entry) => entry.path);
  } catch {
    scenes = [];
  }
  $("fact-scene").setAttribute(
    "description",
    scenes.length ? scenes.slice(0, 3).join(", ") : T.sceneMissing,
  );

  let entry = null;
  try {
    await host.files.text("executor/src/main.rs");
    entry = "executor/src/main.rs";
  } catch {
    entry = null;
  }
  if (!entry) {
    try {
      await host.files.text("src/main.rs");
      entry = "src/main.rs";
    } catch {
      entry = null;
    }
  }
  $("fact-entry").setAttribute("description", entry ?? T.entryMissing);
}

function shortVersion(text) {
  return String(text ?? "").match(/\d+\.\d+\.\d+/)?.[0] ?? String(text ?? "");
}

function renderEnvironment(result) {
  const env = result ?? {};
  environment = env;
  if (typeof env.isWindows === "boolean") {
    platform.isWindows = env.isWindows;
    platform.isMac = Boolean(env.isMac);
    platform.isLinux = Boolean(env.isLinux);
  }
  const rust = env.rust ?? {};
  const linker = env.linker ?? {};
  const rustVersion = shortVersion(rust.rustc);
  const versionOk = env.versionOk !== false;

  setDep(
    "rust",
    !rust.installed || !versionOk ? "bad" : "good",
    !rust.installed ? T.notInstalled : !versionOk ? T.rustOld : T.ready,
    `${T.essential} · ${
      !rust.installed
        ? T.notInstalled
        : !versionOk
          ? `${rustVersion} < ${env.requiredRust ?? "?"}`
          : `rustc ${rustVersion}`
    }`,
  );

  let linkerState = T.ready;
  let linkerTone = "good";
  if (!rust.installed) {
    linkerState = T.needsRust;
    linkerTone = "warning";
  } else if (!linker.ok) {
    linkerState = T.notInstalled;
    linkerTone = "bad";
  }
  setDep(
    "linker",
    linkerTone,
    linkerState,
    `${T.essential} · ${linkerState}${linkerTone === "bad" ? ` — ${platformTool(env)}` : ""}`,
  );

  setDep(
    "clippy",
    env.clippy ? "good" : "bad",
    env.clippy ? T.ready : T.notInstalled,
    `${T.optional} · ${env.clippy ? T.ready : T.notInstalled}`,
  );
  setDep("editor", "neutral", null, `${T.optional} · ${T.editorHint}`);
  const editor = env.editor ?? {};
  const detected = editor.detected ?? null;
  const wrong = Boolean(editor.configured && editor.kind === "project_manager");
  const good = Boolean(editor.configured && editor.exists && !wrong);
  if (editor.integrated) {
    setDep("editor", "good", T.editorIntegrated, `${T.optional} · ${T.editorIntegrated}`);
    $("editor-path").style.display = "none";
    $("use-editor").style.display = "none";
    $("find-editor").style.display = "none";
    $("download-editor").style.display = "none";
    $("clear-editor").style.display = "none";
    $("open-editor").style.display = "";
  } else if (good) {
    setDep("editor", "good", T.editorFound, `${T.optional} · ${T.editorFound}`);
    $("editor-path").setAttribute("path", editor.path);
    $("editor-path").style.display = "";
    $("use-editor").style.display = "none";
    $("find-editor").style.display = "";
    $("download-editor").style.display = "";
    $("open-editor").style.display = "none";
  } else if (detected) {
    setDep(
      "editor",
      wrong ? "warning" : "neutral",
      wrong ? T.projectManager : T.editorDetected,
      wrong ? `${T.optional} · ${T.wrongManager}` : `${T.optional} · ${T.editorDetected}`,
    );
    $("editor-path").setAttribute("path", detected);
    $("editor-path").style.display = "";
    $("use-editor").setAttribute("input", JSON.stringify({ path: detected }));
    $("use-editor").style.display = "";
    $("find-editor").style.display = "";
    $("download-editor").style.display = "";
    $("open-editor").style.display = "none";
  } else if (wrong) {
    setDep("editor", "warning", T.projectManager, `${T.optional} · ${T.wrongManager}`);
    $("editor-path").setAttribute("path", editor.path);
    $("editor-path").style.display = "";
    $("use-editor").style.display = "none";
    $("find-editor").style.display = "";
    $("download-editor").style.display = "";
    $("open-editor").style.display = "none";
  } else if (editor.configured && editor.path) {
    setDep("editor", "warning", T.editorNotFound, `${T.optional} · ${T.editorNotFound}`);
    $("editor-path").setAttribute("path", editor.path);
    $("editor-path").style.display = "";
    $("use-editor").style.display = "none";
    $("find-editor").style.display = "";
    $("download-editor").style.display = "";
    $("open-editor").style.display = "none";
  } else {
    setDep("editor", "neutral", T.editorOptional, `${T.optional} · ${T.editorHint}`);
    $("editor-path").style.display = "none";
    $("use-editor").style.display = "none";
    $("find-editor").style.display = "";
    $("download-editor").style.display = "";
    $("open-editor").style.display = "none";
  }
  $("clear-editor").style.display =
    !editor.integrated && editor.configured && editor.source === "saved" ? "" : "none";
  $("status-editor").style.display = "";

  const manager = env.manager ?? {};
  const managerInstalled = Boolean(manager.installed);
  const managerState = managerInstalled ? T.viaCargo : T.notInstalled;
  setDep(
    "manager",
    managerInstalled ? "good" : "bad",
    managerState,
    `${T.optional} · ${managerState}`,
  );
  if (managerInstalled && manager.path) {
    $("manager-path").setAttribute("path", manager.path);
    $("manager-path").style.display = "";
  } else {
    $("manager-path").style.display = "none";
  }
  $("status-manager").style.display = "";
  $("install-manager").style.display = !managerInstalled && rust.installed ? "" : "none";
  $("update-manager").style.display = managerInstalled ? "" : "none";

  $("copy-rust").style.display = "";
  $("copy-linker").style.display = "";
  $("download-linker").style.display = platform.isWindows ? "" : "none";
  $("install-clippy").style.display = env.rustup && !env.clippy ? "" : "none";
  $("update-rust").style.display = rust.installed && env.rustup ? "" : "none";
  $("update-clippy").style.display = env.rustup && env.clippy ? "" : "none";
  $("gnu-alternative").style.display =
    platform.isWindows && rust.installed && !linker.ok ? "" : "none";
}

function environmentSummary(env) {
  const rust = env.rust ?? {};
  const parts = [];
  if (rust.installed) {
    const version = shortVersion(rust.rustc);
    parts.push(
      env.versionOk === false
        ? `${T.depRust}: ${version} < ${env.requiredRust ?? "?"}`
        : `Rust ${version}`,
    );
  } else {
    parts.push(`${T.depRust}: ${T.notInstalled}`);
  }
  parts.push(
    `${T.depLinker}: ${
      env.linker?.ok
        ? T.ready
        : `${T.notInstalled}${platform.isWindows ? ` — ${platformTool(env)}` : ""}`
    }`,
  );
  parts.push(`Clippy: ${env.clippy ? T.ready : T.notInstalled}`);
  return parts.join(" · ");
}

function runDoctor() {
  doctorBtn.click();
}

doctorBtn.addEventListener("omg-command-start", () => {
  showEnvResult("info", T.verify, T.verifying);
  for (const key of ["rust", "linker", "clippy"]) setDep(key, "busy", T.notChecked, T.notChecked);
});

function renderBuildDir(env) {
  const dir = env.targetDir || T.buildDirDefault;
  const free = typeof env.disk?.freeBytes === "number" ? env.disk.freeBytes : null;
  const gb = free === null ? null : free / 1024 ** 3;
  let text = `${T.buildDir}: ${dir}`;
  if (gb !== null) text += ` — ${gb.toFixed(1)} ${T.buildDirFree}`;
  if (gb !== null && gb < 5) text += ` (${T.buildDirLow}) ${T.buildDirHint}`;
  $("build-dir").textContent = text;
}

doctorBtn.addEventListener("omg-command-result", (event) => {
  const env = parseResult(event);
  renderEnvironment(env);
  renderBuildDir(env);
  const ready = Boolean(env.ready ?? (env.rust?.installed && env.linker?.ok));
  showEnvResult(
    ready ? "good" : "warning",
    ready ? T.envReadyHeading : T.envMissingHeading,
    environmentSummary(env),
  );
  if (!ready) {
    if (buildResultEl.style.display === "none" || setupWarningShown) {
      const text = !env.rust?.installed
        ? T.hints.cargo_missing
        : env.versionOk === false
          ? `${shortVersion(env.rust.rustc)} < ${env.requiredRust ?? "?"}. ${T.rustOldHint}`
          : platform.isWindows
            ? T.hints.missing_linker
            : T.hints.missing_linker_unix;
      showBuildResult({
        tone: "warning",
        heading: T.setupIncomplete,
        text,
        actionLabel: T.seeEnvironment,
        action: scrollToEnvironment,
      });
      setupWarningShown = true;
    }
  } else if (setupWarningShown) {
    hideBuildResult();
    setupWarningShown = false;
  }
});

doctorBtn.addEventListener("omg-command-error", (event) => {
  event.preventDefault();
  const error = String(event.detail?.error ?? "");
  const info = actionError(error, T.envCheckFailedHeading);
  showEnvResult("warning", info.heading, info.text);
});

const actions = [
  { id: "install-clippy", label: T.depClippy, kind: "install", row: "clippy" },
  { id: "install-manager", label: T.depManager, kind: "install", row: "manager" },
  { id: "update-rust", label: "Rust", kind: "update", row: "rust" },
  { id: "update-clippy", label: "Clippy", kind: "update", row: "clippy" },
  { id: "update-manager", label: T.depManager, kind: "update", row: "manager" },
];

for (const { id, label, kind, row } of actions) {
  const button = $(id);
  const heading = kind === "update" ? T.updateHeading : T.installHeading;
  const failure = kind === "update" ? T.updateFailed : T.installFailed;
  const started = kind === "update" ? T.updating : T.installing;
  button.addEventListener("omg-command-start", () => {
    installLines = [];
    installLogEl.text = "";
    installLogEl.style.display = "";
    showEnvResult("info", heading, `${started} ${label}`);
    setDep(row, "busy", started, `${label}: ${started}`);
    toast(`${started} ${label}`);
    envResultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  button.addEventListener("omg-command-result", (event) => {
    const result = parseResult(event);
    if (result.output) renderInstallLog(result.output);
    if (result.installed) {
      const done = kind === "update" ? `${T.updated}: ${label}` : `${T.installOk}: ${label}`;
      showEnvResult("good", heading, done);
      setDep(row, "good", kind === "update" ? T.updated : T.installOk, done);
      toast(done, "success");
      setTimeout(runDoctor, 900);
    } else {
      if (result.firstError) renderInstallLog(result.firstError);
      const reason = shortError(result.firstError ?? result.error ?? result.code ?? "");
      showEnvResult("bad", failure, `${label}: ${reason}`);
      setDep(row, "bad", T.failed, `${label}: ${reason}`);
      toast(`${failure}: ${label}`, "danger");
    }
    envResultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  button.addEventListener("omg-command-error", (event) => {
    event.preventDefault();
    const error = String(event.detail?.error ?? "");
    const info = actionError(error, failure);
    const guidance = info.heading === T.blockedHeading || info.heading === T.busyHeading;
    showEnvResult("bad", info.heading, guidance ? info.text : `${label}: ${info.text}`);
    setDep(row, "bad", T.failed, `${label}: ${info.text}`);
    toast(`${failure}: ${label}`, "danger");
    envResultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

checkBtn.addEventListener("omg-command-start", () => {
  renderLog([]);
  hideBuildResult();
  setState("busy", T.checking);
  showBuildResult({ tone: "info", heading: T.checking, text: T.checkStartText });
});

checkBtn.addEventListener("omg-command-result", (event) => {
  const result = parseResult(event);
  const lines = result.output ? String(result.output).split(/\r?\n/) : [];
  if (result.firstError && !lines.includes(result.firstError)) lines.unshift(result.firstError);
  if (lines.length) renderLog(lines);

  if (result.ok) {
    setState("good", T.ok);
    showBuildResult({
      tone: "good",
      heading: T.ok,
      text: `cargo check: ${result.seconds ?? "?"}s`,
    });
  } else {
    setState("bad", T.failed);
    const info = hintForBuild(result.hint ?? "compile_errors");
    showBuildResult({
      tone: "bad",
      heading: info.heading,
      text: `${info.text} (cargo ${result.code ?? "?"}, ${result.seconds ?? "?"}s)`,
      actionLabel: info.actionLabel,
      action: info.action,
    });
  }
  loadInfo();
});

checkBtn.addEventListener("omg-command-error", (event) => {
  event.preventDefault();
  const error = String(event.detail?.error ?? "");
  setState("bad", T.failed);
  renderLog([error]);
  const info = actionError(error, T.actionFailed);
  showBuildResult({
    tone: "warning",
    heading: info.heading,
    text: info.text,
    actionLabel: T.seeEnvironment,
    action: scrollToEnvironment,
  });
});

playBtn.addEventListener("omg-command-start", () => {
  setState("busy", T.starting);
  showBuildResult({ tone: "info", heading: T.compiling, text: T.runStartText });
});

playBtn.addEventListener("omg-command-result", (event) => {
  const result = parseResult(event);
  if (!result.started) {
    setState("bad", T.failed);
    const info = hintForBuild(
      result.error === "cargo_missing"
        ? "cargo_missing"
        : result.error === "missing_linker"
          ? "missing_linker"
          : result.error === "already_running"
            ? "already_running"
            : "generic",
    );
    showBuildResult({
      tone: "bad",
      heading: info.heading,
      text: info.text,
      actionLabel: info.actionLabel,
      action: info.action,
    });
    if (result.message) appendLog(String(result.message));
    return;
  }
  setState("busy", T.compiling);
  showBuildResult({ tone: "info", heading: T.compiling, text: T.runStartText });
  watchRunLog(result.logFile || "fyrox-run.log");
});

playBtn.addEventListener("omg-command-error", (event) => {
  event.preventDefault();
  const error = String(event.detail?.error ?? "");
  setState("bad", T.failed);
  const info = actionError(error, T.actionFailed);
  showBuildResult({
    tone: "warning",
    heading: info.heading,
    text: info.text,
    actionLabel: T.seeEnvironment,
    action: scrollToEnvironment,
  });
});

host.on("progress", ({ command, message }) => {
  if (command === "fyrox-check" || command === "fyrox-play") appendLog(message);
  else if (command === "fyrox-install") renderInstallLog(message);
});

async function watchRunLog(file) {
  let last = "";
  let started = false;
  let quiet = 0;

  const fail = (kind) => {
    setState("bad", T.failed);
    const info = hintForBuild(kind);
    showBuildResult({
      tone: "bad",
      heading: info.heading,
      text: info.text,
      actionLabel: info.actionLabel,
      action: info.action,
    });
  };

  for (let attempt = 0; attempt < 160; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt < 40 ? 1500 : 4000));
    let text = "";
    try {
      text = await host.files.text(file);
    } catch {
      continue;
    }
    if (text && text !== last) {
      last = text;
      renderLog(text.split(/\r?\n/));
    }
    if (/thread 'main' panicked|panicked at|process didn't exit successfully/i.test(text)) {
      fail("panic");
      return;
    }
    if (
      /(?:failed|error)[^\n]{0,40}(?:create|initializ)[^\n]{0,30}(?:window|graphics|opengl|gl context)|no available video device|glutin|wayland[^\n]{0,40}(?:error|failed)|x11[^\n]{0,40}(?:error|failed)/i.test(
        text,
      )
    ) {
      fail("graphics");
      return;
    }
    if (/error\[E\d+\]|error: could not compile|error: linking with|linker .*not found/i.test(text)) {
      fail(/link|linking with/i.test(text) ? "missing_linker" : "compile_errors");
      return;
    }
    if (!started && /Finished|Running/i.test(text)) {
      started = true;
      quiet = 0;
      setState("good", T.running);
      showBuildResult({ tone: "good", heading: T.running, text: T.runOpenText });
    }
    if (started) {
      quiet += 1;
      if (quiet >= 15) return;
    } else if (attempt === 20) {
      setState("busy", T.compilingFirst);
      showBuildResult({ tone: "info", heading: T.compiling, text: T.runStartText });
    }
  }
  setState("neutral", T.noResult);
}

$("find-editor").addEventListener("omg-command-start", () => toast(T.searching));
$("find-editor").addEventListener("omg-command-result", (event) => {
  const result = parseResult(event);
  const found = Array.isArray(result.found) ? result.found : [];
  if (!found.length) {
    toast(T.editorNoneFound, "default");
    return;
  }
  const path = found[0];
  setDep("editor", "neutral", T.editorDetected, `${T.optional} · ${T.editorDetected}`);
  $("editor-path").setAttribute("path", path);
  $("editor-path").style.display = "";
  $("use-editor").setAttribute("input", JSON.stringify({ path }));
  $("use-editor").style.display = "";
  $("status-editor").style.display = "";
  toast(`${T.editorDetected}: ${found.length}`, "success");
});
$("find-editor").addEventListener("omg-command-error", (event) => {
  event.preventDefault();
  const error = String(event.detail?.error ?? "");
  const info = actionError(error, T.editorNoneFound);
  toast(info.text, "danger");
});

$("open-editor").addEventListener("omg-command-start", () => toast(T.editorStarting));
$("open-editor").addEventListener("omg-command-result", (event) => {
  const result = parseResult(event);
  if (!result.started) {
    setState("bad", T.failed);
    const info = hintForBuild(
      result.error === "cargo_missing"
        ? "cargo_missing"
        : result.error === "missing_linker"
          ? "missing_linker"
          : result.error === "already_running"
            ? "already_running"
            : "generic",
    );
    showBuildResult({
      tone: "bad",
      heading: info.heading,
      text: info.text,
      actionLabel: info.actionLabel,
      action: info.action,
    });
    if (result.message) appendLog(String(result.message));
    return;
  }
  setState("busy", T.compiling);
  showBuildResult({ tone: "info", heading: T.compiling, text: T.editorStartText });
  watchEditorLog(result.logFile || "fyrox-editor.log");
});
$("open-editor").addEventListener("omg-command-error", (event) => {
  event.preventDefault();
  const error = String(event.detail?.error ?? "");
  const info = actionError(error, T.actionFailed);
  toast(`${info.heading}: ${info.text}`, "danger");
});

$("clear-editor").addEventListener("omg-command-result", (event) => {
  const result = parseResult(event);
  if (result.cleared) {
    toast(T.editorCleared, "success");
    setTimeout(runDoctor, 500);
  } else {
    toast(T.editorSaveFailed, "danger");
  }
});
$("clear-editor").addEventListener("omg-command-error", (event) => {
  event.preventDefault();
  toast(T.editorSaveFailed, "danger");
});

$("use-editor").addEventListener("omg-command-start", () => toast(T.saving));
$("use-editor").addEventListener("omg-command-result", (event) => {
  const result = parseResult(event);
  if (result.saved) {
    toast(T.editorSaved, "success");
    setTimeout(runDoctor, 500);
  } else {
    toast(`${T.editorSaveFailed}: ${result.error ?? "?"}`, "danger");
  }
});
$("use-editor").addEventListener("omg-command-error", (event) => {
  event.preventDefault();
  toast(T.editorSaveFailed, "danger");
});

async function watchEditorLog(file) {
  let last = "";
  let opened = false;
  let quiet = 0;
  for (let attempt = 0; attempt < 160; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt < 40 ? 1500 : 4000));
    let text = "";
    try {
      text = await host.files.text(file);
    } catch {
      continue;
    }
    if (text && text !== last) {
      last = text;
      renderLog(text.split(/\r?\n/));
    }
    if (/error\[E\d+\]|error: could not compile|error: linking with|linker .*not found/i.test(text)) {
      setState("bad", T.failed);
      const info = hintForBuild(/link|linking with/i.test(text) ? "missing_linker" : "compile_errors");
      showBuildResult({
        tone: "bad",
        heading: info.heading,
        text: info.text,
        actionLabel: info.actionLabel,
        action: info.action,
      });
      return;
    }
    if (!opened && /Finished|Running/i.test(text)) {
      opened = true;
      quiet = 0;
      setState("good", T.editorOpened);
      showBuildResult({ tone: "good", heading: T.editorOpened, text: T.editorOpenText });
      toast(T.editorOpened, "success");
    }
    if (opened) {
      quiet += 1;
      if (quiet >= 15) return;
    } else if (attempt === 20) {
      setState("busy", T.compilingFirst);
      showBuildResult({ tone: "info", heading: T.compiling, text: T.editorStartText });
    }
  }
}

$("download-rust").addEventListener("click", () => openPage(LINKS.rust));
$("download-linker").addEventListener("click", () => openPage(LINKS.linker));
$("download-editor").addEventListener("click", () => openPage(LINKS.editor));
$("copy-rust").addEventListener("click", () => copyCommand(rustCommand(platform)));
$("copy-linker").addEventListener("click", () => copyCommand(linkerCommand(platform)));
$("copy-gnu").addEventListener("click", () => copyCommand(gnuCommands()));
$("link-msys2").addEventListener("click", () => openLink(LINKS.msys2));
$("book").addEventListener("click", () => openLink(LINKS.book));
$("api").addEventListener("click", () => openLink(LINKS.api));

let refreshTimer = null;
host.on("files", () => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(loadInfo, 800);
});

applyStrings();
await loadInfo();
showEnvResult("info", T.environment, T.verifyPrompt);

// Check the toolchain when the panel opens; the button stays for a re-check.
setTimeout(() => {
  doctorBtn.click();
}, 250);
