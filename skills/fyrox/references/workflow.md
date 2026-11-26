# Fyrox workflow

## Dependencies

Before a prompt is sent in a Fyrox project, the plugin runs this check and, when
something essential is missing, the prompt waits while the Fyrox panel opens with
the missing item. The panel's Environment section runs the same check and shows
each dependency as essential or optional with its status, offering the official
installer or a copyable command. The plugin itself only runs `cargo`, `rustup` and
`rustc`: it never runs an OS package manager, so nothing system-wide is installed
without the person doing it.

| Dependency | Needed for | Essential? | Install |
| --- | --- | --- | --- |
| Rust (`rustup`, `cargo`, `rustc`) | Building and running any Fyrox game | Yes | <https://rustup.rs>, or `winget install Rustlang.Rustup` on Windows |
| C linker / build tools | Linking the game | Yes | Windows: Visual Studio Build Tools with the C++ workload. macOS: `xcode-select --install`. Linux: `build-essential`, `pkg-config`, `libasound2-dev` |
| Clippy | `cargo clippy` lints | No | `rustup component add clippy` (one button in the panel) |
| Fyroxed | Editing scenes visually | No | <https://fyrox.rs/download.html> |
| `fyrox-project-manager` | Managing projects outside OhMyGame; the complete type already ships its layout | No | `cargo install fyrox-project-manager` (Install via cargo in the panel) |

The first build also needs network access to crates.io. Nothing else is required:
the Rust toolchain plus a linker is the whole essentials list.

### Alternative on Windows: the GNU toolchain

MSVC with the Build Tools is the default because it is what Fyrox and most crates
are tested with. Windows can link with MinGW-w64 instead, through Rust's
`x86_64-pc-windows-gnu` target (Tier 1, no Visual Studio license):

1. Install MinGW-w64: MSYS2 (`winget install MSYS2.MSYS2`, then
   `pacman -S --needed mingw-w64-x86_64-toolchain` in the MinGW64 shell) or a
   standalone WinLibs build, with `mingw64\bin` on the PATH.
2. `rustup toolchain install stable-x86_64-pc-windows-gnu`
3. In the project folder: `rustup override set stable-x86_64-pc-windows-gnu`.
   The override applies to this project only; other projects keep MSVC.

`cargo` then calls `gcc`/`ld` from MinGW. Caveats: the GNU targets have no
dedicated maintainers and may be demoted; some crates need a full MinGW
installation; Fyrox is developed and tested mainly with MSVC. A more advanced
route is `cargo-xwin`, which downloads the MSVC CRT/SDK and links with
`lld-link`: no Visual Studio install, but still the MSVC ABI and not a
one-click setup.

### macOS and Linux

On macOS the Xcode Command Line Tools are the supported linker and SDK, with no
lighter official path. On Linux any C toolchain works (gcc or clang plus
binutils/lld); the package names change per distribution, and the dev libraries
(`pkg-config`, ALSA) are listed above.

- `cargo --version` and `rustc --version` show what is installed.
- A quick linker check is compiling a one-line `fn main() {}` with `rustc`; if that
  fails on `link.exe`, the C++ workload is missing even though Rust is present.
- After installing Rust, its `bin` folder may not be on the PATH of a running
  OhMyGame; the plugin also looks in `%USERPROFILE%\.cargo\bin`, and reopening
  OhMyGame fixes the PATH.
- Keep `target/` (it is what makes later builds fast and is already gitignored).

## Compile and run

The plugin's panel and commands run these in the project folder:

| Action | Command | What it does |
| --- | --- | --- |
| Check | `cargo check --message-format=short` | Type-checks; the fastest signal for errors. |
| Run game | `cargo run` | Builds and opens the game window. Output goes to `fyrox-run.log`. |
| Build | `cargo build [--release]` | Produces `target/debug/game` or `target/release/game`. |
| Lint | `cargo clippy` | Needs `rustup component add clippy`. |

`cargo check` with no errors does not prove the game runs: it says nothing about
missing assets or a wrong scene path. A run is the real test, and it happens on
the person's desktop, in a separate window.

Build artifacts can go to another drive: the plugin's **Build folder (target)**
setting runs cargo with `CARGO_TARGET_DIR`, so `target/` (often several GB, more
with the editor) can live on a drive with free space. The panel shows the folder
and its free space after Verify.

The engine logs to `game.log` (set in `main.rs`) next to `Cargo.toml`. `RUST_BACKTRACE=1`
makes a panic print a backtrace there.

## The editor (Fyroxed)

Fyroxed is Fyrox's scene editor, downloaded from <https://fyrox.rs/download.html>.
It is portable: extract it and run it, no installation. It opens
`data/scene.rgs`, where the starter camera, light and cube live, and it does not
need Rust — only building and running the game does. Use it for placing nodes,
materials, prefabs and animation; save back into `data/`.

Scripts made in code only appear in the editor if they are registered in
`Plugin::register` and the editor was built with the game plugin. Without that,
attach scripts from code in the scene load callback.

`.rgs` is Fyrox's own text format (`FTAX`). It is readable but generated by the
editor; edit it by hand only for tiny changes and check that the scene still
loads.

## The official project layout

The one-crate project here is the small version. The plugin's **Fyrox complete
(workspace)** project type ships the official layout (the same one the Fyrox
project manager or `fyrox-template` creates):

- `game/` — the game as a library (the same `Game` plugin).
- `executor/` — desktop binary; `game-dylib/` plus the `dylib` feature give hot
  reloading of `game/` while it runs.
- `editor/` — Fyroxed built with the game plugin, so scripts are assignable.
- `executor-wasm/` — web build (`wasm32-unknown-unknown`, `wasm-bindgen`).
- `executor-android/` — Android build.
- `export-cli/` — command-line export.
- `data/` — scene and assets.

The plugin's **Fyrox complete (workspace)** project type ships this layout. In it,
`cargo check -p game -p executor` is the quick check, `cargo run -p executor` runs
the game, and `cargo run -p editor` opens the integrated editor. The panel's
Check, Run game and editor row use exactly those commands.

Moving this project into that layout is fine; keep the code in `src/` as the
`game/src/` crate and add `mod` lines for each script file.

## Export and release

`fyrox-build-tools` (with `fyroxed_base`) exposes `cli_export`, used by the
official `export-cli`: `cargo run -p export-cli -- --target-platform pc`. It copies
assets and the executable into a folder for shipping. A game is not a web page:
`cargo run` is the normal way to play while developing.

## When something goes wrong

- **cargo cannot reach crates.io** — network, proxy or certificate problem. cargo
  honours `HTTP_PROXY`/`HTTPS_PROXY`; a corporate proxy needs its CA installed.
  The panel reports it as a network problem; retry after fixing the connection.
- **The first build takes very long** — Fyrox is large and the template optimizes
  dependencies in dev builds, so the first `cargo check`/`cargo run` downloads and
  compiles hundreds of crates (often 5–20 minutes, around 2 GB in `target/`).
  Later builds are incremental; do not delete `target/` to make it faster.
- **`link.exe` fails although the Build Tools are installed** — another
  `link.exe` may come first on PATH (Git, GNU tools), or the C++ workload is
  missing. Check `where link.exe` and install/repair “Desktop development with
  C++”, or use the GNU/MinGW path.
- **Rust is too old** — the project's `rust-version` is enforced; run
  `rustup update`.
- **The game window does not open** — the GPU/driver needs OpenGL 3.3+; virtual
  machines and remote desktops often have no acceleration. Check `game.log` and
  `fyrox-run.log`, update the driver, or try a local desktop session.
- **The game crashes right after starting** — the run log shows the panic; set
  `RUST_BACKTRACE=1` for a backtrace. Assets must live under `data/`, and paths
  are case-sensitive on Linux and macOS.
- **Antivirus or OneDrive locks the build** — exclude the project folder or move
  it out of a synced folder; `EBUSY`/`EPERM` on `target/` usually means a scanner
  or sync client holds a file.
- **Paths with spaces or accents** — allowed, but some tools and assets behave
  better with ASCII names; keep the project path simple.
- **Fyroxed version** — use an editor matching the `fyrox` version in
  `Cargo.toml` (1.0.x) and keep a copy of `data/scene.rgs` before large edits.
- **Web or Android** — this template builds desktop. Use the official project
  manager for the wasm and Android executors.

## Where to look things up

- 1.0.1 API docs: <https://docs.rs/fyrox/1.0.1/fyrox/>
- Book (editor, scripting, tutorials): <https://fyrox-book.github.io/>
- Release notes for behaviour changes: <https://fyrox.rs/blog/>
- The installed crate sources, which never disagree with the compiler:
  `~/.cargo/registry/src/*/fyrox-impl-<version>/src` and
  `~/.cargo/registry/src/*/fyrox-ui-<version>/src`.

Most online tutorials and videos were written for 0.2x–0.3x. In 1.0 there is no
`PluginConstructor` (a plugin is added with `Executor::add_plugin` and starts in
`Plugin::init`), plugins must derive `Visit` and `Reflect`, and `PluginContext`
holds `scenes`, `resource_manager`, `user_interfaces`, `dt`, `input_state`,
`loop_controller` and `performance_statistics`. When a tutorial disagrees with
the crate sources, the sources win.
