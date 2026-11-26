# Fyrox game (full workspace)

The official Fyrox 1.0 project layout, the same one the Fyrox project manager
creates: the game as a library, a desktop executor, an editor built with the
game plugin, a hot-reload wrapper, and web/Android executors.

## Requirements

- Rust through <https://rustup.rs>.
- A C linker: on Windows the Visual Studio Build Tools with the **Desktop
  development with C++** workload; on macOS the Xcode Command Line Tools; on
  Linux `build-essential` and `pkg-config`.
- The first build compiles the whole engine and is slow.

## Run

- Game: `cargo run -p executor`
- Editor (Fyroxed with this game's scripts): `cargo run -p editor`
- Check the game code: `cargo check -p game -p executor`
- Hot reload (Windows/Linux/macOS):
  `cargo run -p executor --features dylib --profile dev-hot-reload` and
  `cargo run -p game-dylib --features dylib-engine --profile dev-hot-reload`
- Export: `cargo run -p export-cli -- --target-platform pc`
- Web: see `executor-wasm/README.md`. Android: see `executor-android/README.md`.

The OhMyGame Fyrox panel's Check and Run game use the same commands; the editor
row starts the integrated editor.

## Layout

- `game/` — the game as a library (`Game` plugin, scripts, rules).
- `executor/` — desktop binary that runs the game plugin.
- `editor/` — Fyroxed built with the game plugin, so scripts can be assigned in
  the editor. It opens `data/scene.rgs`.
- `game-dylib/` — dynamic library used for hot reloading.
- `executor-wasm/` — web executor and its HTML/JS launcher.
- `executor-android/` — Android executor (needs the Android SDK/NDK).
- `export-cli/` — command-line export.
- `data/` — scene and assets, relative to the workspace root.

## Credits

The workspace layout and `data/scene.rgs` come from the official Fyrox project
template (FyroxEngine/Fyrox), MIT licensed. See `FYROX-LICENSE.txt`.
