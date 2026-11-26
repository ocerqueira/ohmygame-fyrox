# Changelog

## 0.1.0

First release.

- Project types:
  - **Fyrox game (Rust)** — lean single crate with the starter 3D scene, the
    executor and the game plugin.
  - **Fyrox complete (workspace)** — the official layout with `game/`,
    `executor/`, an editor built with the game plugin, hot reload, web and
    Android executors and the export CLI.
- Panel:
  - project facts (engine version, scenes, entry point);
  - Check and Run game with the cargo output, elapsed time and plain-language
    failures (linker, compilation, missing cargo, network);
  - Environment check with the Rust version gate, a real linker test, Clippy,
    Fyroxed (portable, detected or pointed to) and the project manager (cargo);
  - Install/Update through cargo and rustup, with progress and result toasts;
  - a build folder on another drive (`CARGO_TARGET_DIR`) and free-space display;
  - readiness gate before a prompt, with localized messages (English and
    Portuguese).
- Agent Skill: Fyrox 1.0.1 API, scenes, scripts, assets, compile loop and a
  troubleshooting reference.
- MIT license. The starter scene comes from the official Fyrox template.
