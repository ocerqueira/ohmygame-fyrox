# Fyrox (Rust) — OhMyGame plugin

Make 2D and 3D games with [Fyrox](https://fyrox.rs), the Rust game engine, inside
OhMyGame.

- **Project type**: a Rust project with Fyrox 1.0, the starter 3D scene, the
  executor and the game plugin, ready to edit. A second type, **Fyrox complete
  (workspace)**, creates the official project-manager layout with the integrated
  editor, hot reload, web and Android executors.
- **Panel**: project facts, check/run with the cargo output, and an Environment
  section that lists every dependency as essential or optional, checks it, and
  offers the official installer or a copyable command.
- **Agent Skill**: the Fyrox 1.0 API, scenes, scripts, assets and the compile
  loop, grounded in the crate sources rather than outdated tutorials.
- **Tool and commands**: `fyrox_cargo` for the agent (`check`, `build`, `clippy`),
  plus Check, Run game and Check the environment from the UI.

## Dependencies

Essential: Rust (`rustup`, `cargo`, `rustc`) and a C linker — Visual Studio
Build Tools with the C++ workload on Windows, Xcode Command Line Tools on macOS,
`build-essential` on Linux. Optional: Clippy, [Fyroxed](https://fyrox.rs/download.html)
(portable: extract and run, no installation, and it needs no Rust) and the
`fyrox-project-manager` (installed with `cargo install fyrox-project-manager`).

The full workspace type ships the layout the official `fyrox-project-manager`
creates, so the manager app is optional; it remains useful for projects managed
outside OhMyGame.

On Windows the panel also documents the lighter alternative to Visual Studio:
Rust's GNU target (`x86_64-pc-windows-gnu`) with MinGW-w64, set per project with
`rustup override`. MSVC stays the recommended default; the GNU targets have fewer
maintainers and some crates need the full MinGW installation.

Before a prompt is sent in a Fyrox project, the plugin checks Rust and the linker.
When something essential is missing, the prompt waits and the Fyrox panel opens
with the missing item and its install path. The same check runs when you press
**Verify** in the panel, and every action there ends with a clear result. When
Rust or Clippy are already installed, the panel offers **Update**
(`rustup update`) instead of Install.

Builds can live on another drive: set **Build folder (target)** in the plugin
settings (it runs cargo with `CARGO_TARGET_DIR`) and the panel shows that folder
and its free space. This keeps the multi-gigabyte `target/` off a full C: drive,
for example `P:\caches\fyrox-target`.

The panel only runs `cargo`, `rustup` and `rustc`; it never runs an OS package
manager. Clippy and the project manager install with one click via cargo
(user-scoped); Rust, the linker and Fyroxed are installed by the person through
the official installer, with a copyable command for terminal users.

The game is a native Rust binary: it opens in its own window, not in the
OhMyGame web preview.

## Links

- Author: [ocerqueira](https://github.com/ocerqueira) · <https://ocerqueira.com>
- Repository: <https://github.com/ocerqueira/ohmygame-fyrox>
- Fyrox: <https://fyrox.rs> · Book: <https://fyrox-book.github.io/>
- Fyrox API 1.0: <https://docs.rs/fyrox/1.0.1/fyrox/>

## License

MIT — see [LICENSE](./LICENSE). The starter scene in `template/data/scene.rgs`
comes from the official Fyrox project template, MIT licensed; see
`template/FYROX-LICENSE.txt`.
