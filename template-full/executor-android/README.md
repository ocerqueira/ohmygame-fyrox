# Android build

This crate builds the game for Android with `cargo-apk` (or the project
exporter). It needs the Android SDK/NDK and a signing keystore.

- Put a keystore at `executor-android/release.keystore` and set its password in
  `Cargo.toml` under `[package.metadata.android.signing.release]`.
- The project exporter copies `data/` into `executor-android/assets/` before
  building; do not edit that folder by hand.
- The wasm and desktop builds do not need any of this.
