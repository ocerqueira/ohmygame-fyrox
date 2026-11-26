# Fyrox game

A 2D/3D game in Rust with [Fyrox 1.0](https://fyrox.rs).

## Requirements

- Rust through [rustup](https://rustup.rs).
- A C linker for the Rust target:
  - Windows: Visual Studio Build Tools with the **Desktop development with C++**
    workload (<https://visualstudio.microsoft.com/visual-cpp-build-tools/>).
  - macOS: Xcode Command Line Tools (`xcode-select --install`).
  - Linux: `build-essential`, `pkg-config`, `libasound2-dev` (Debian/Ubuntu names).

Without the linker, cargo fails with an error such as `linking with link.exe failed`.
The first build compiles the whole engine and is slow; later builds are fast.

## Run

From the OhMyGame **Fyrox** panel: **Check** shows the compiler output and
**Run game** opens the game in its own window (the OhMyGame preview only shows
web games).

From a terminal:

```bash
cargo run        # build and open the game
cargo check      # only report errors, faster
```

The game writes `game.log` next to `Cargo.toml`.

## Layout

- `src/main.rs` — creates the `Executor` and adds the `Game` plugin.
- `src/game.rs` — the plugin: global state, `update`, keyboard events, UI.
- `data/scene.rgs` — the starter scene (cube, camera, point light).
- `data/` — textures, sounds, models and animations. Paths in code are relative
  to the project folder, such as `data/texture.png`.

The `.rgs` scene is Fyrox's own text format. Edit it with Fyroxed; code can also
create nodes and attach scripts.

## Editor (Fyroxed)

Fyroxed is self-contained: download it from <https://fyrox.rs/download.html>,
extract it and run it; no installation is needed. It opens `data/scene.rgs`.
Fyroxed does not need Rust — only building and running the game does.
For the editor, hot reload and web build inside the project, use the official
`fyrox-project-manager` (`cargo install fyrox-project-manager`) and move `src/`
into the generated `game/` crate.

## Credits

`data/scene.rgs` comes from the official Fyrox project template
(FyroxEngine/Fyrox), MIT licensed. See `FYROX-LICENSE.txt`.
