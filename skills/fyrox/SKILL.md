---
name: fyrox
description: "Builds and changes games made with the Fyrox engine (Rust) in this project, covering the 1.0 API, scenes, scripts, assets and the compile loop. Use whenever the project has a Cargo.toml with `fyrox` and a `data/*.rgs` scene, or the person asks to create, change, fix or run a Fyrox game."
---

# Fyrox game (Rust)

This project is a Fyrox 1.0 game. Read the files before changing them and keep
the layout it already has — there are two:

- **Lean project**: `src/main.rs` starts the engine, `src/game.rs` holds the
  `Game` plugin, `data/` holds the scene and assets. One crate; run it with the
  panel's Run game (it runs `cargo run`).
- **Full workspace** (the official project-manager layout): `game/src/lib.rs`
  holds the `Game` plugin, `executor/` runs it, `editor/` is Fyroxed built with
  the game, and `executor-wasm/`, `executor-android/`, `export-cli/` and
  `game-dylib/` cover web, Android, export and hot reload. `data/` stays at the
  root. The panel's Run game uses `cargo run -p executor` and its editor row
  starts `cargo run -p editor`.

Never move a project from one layout to the other, or turn the game library into
a binary: the executors and the editor depend on the layout. When unsure, run
`fyrox_cargo` with `check` — it uses the right cargo command for the layout.

## Check every change

1. Edit the Rust code.
2. Call the tool `fyrox_cargo` with `{"operation":"check"}`. It runs `cargo check`
   in the project (in a workspace it checks `-p game -p executor`) and returns the
   compiler output. The first run compiles the whole engine and takes minutes;
   later ones are fast.
3. Fix what it reports and call it again. Never assume an API exists: the
   compiler decides. `build` compiles the binary, `clippy` lints.
4. The person runs the game from the Fyrox panel (command `fyrox-play`), which
   opens a window of its own. The OhMyGame preview cannot show a Fyrox game, so
   do not promise playtesting you cannot do: check, and say what still needs a
   run.

If the output mentions `link.exe` (not found, or linking failed), the Rust toolchain
cannot link on this machine; tell the person to install Visual Studio Build Tools
(Desktop development with C++) or switch to the GNU toolchain. `cargo not found`
means Rust is not installed. The Fyrox panel's Environment section lists every
dependency as essential or optional, shows what it found, and gives the official
download or a command the person can copy for each one — point them there instead
of installing tools silently.

Only rustup components (Clippy) and `cargo install` tools have a one-click install
in the panel. Rust itself, the linker and the editor are installed by the person
through the official installer.

## Ground the API

The engine version is in `Cargo.toml` (`fyrox = "1.0.1"`). Most tutorials on the
web are for 0.3x and do not compile on 1.0 (no `PluginConstructor`, plugins use
`init`, scenes are a text `.rgs`). For an exact signature, read the crate source
that is already on disk:

- `~/.cargo/registry/src/*/fyrox-impl-<version>/src/` (on Windows,
  `%USERPROFILE%\.cargo\registry\src\*`), or
- <https://docs.rs/fyrox/1.0.1/fyrox/>.

Search it with the file tools instead of guessing. `references/api.md` has
verified 1.0.1 snippets for the plugin, scenes, nodes, scripts and UI;
`references/workflow.md` covers the toolchain, the editor, logs and export.

## Rules that keep the game working

- Scenes load asynchronously. `load_scene_or_ui` drops the handle; use
  `context.load_scene(path, false, |result, game, ctx| { ... })` to keep the
  scene handle and to add scripts or find nodes after the scene is loaded.
- Keep global state (scene handle, player, score) in `Game`. Put per-object
  behaviour in scripts attached to nodes, so the editor and the game agree.
- Every script needs a unique UUID in `#[type_uuid(id = "...")]`, the derives
  `Visit, Reflect, Default, Debug, Clone, TypeUuidProvider, ComponentProvider`,
  `#[visit(optional)]`, and registration in `Game::register`:
  `context.serialization_context.script_constructors.add::<Player>("Player")`.
  Attach it with `node.add_script(Player::default())` or in the editor; an
  unregistered script cannot be saved or loaded.
- Prefer handles over references: take one mutable borrow of the scene
  (`context.scenes[...]`, then `scene.graph[...]`) and finish with it before
  borrowing the scene or the plugin again, or the borrow checker stops you.
- Input: `context.input_state.is_key_down(KeyCode::KeyW)` in `update`;
  `on_os_event` gets `Event::WindowEvent` for mouse and window events.
- Assets live in `data/` and are requested by paths relative to the project
  root, such as `context.resource_manager.request::<Texture>("data/grass.png")`.
- Do not change the Fyrox version or the `Cargo.toml` profiles on your own; the
  engine in debug builds is optimized so the game stays playable.
- `data/scene.rgs` is Fyrox's text scene format. Change it with Fyroxed, or add
  nodes and scripts from code. If you must edit it by hand, make a small change
  and check that the game still loads it.

## Useful files

- `references/api.md` — plugin, scene loading, nodes in code, scripts, input,
  UI, materials, sound.
- `references/workflow.md` — Rust on Windows, Fyroxed, logs, hot reload,
  export, the full official project layout, and a troubleshooting list (network,
  linker in PATH, no window, panics, antivirus).
