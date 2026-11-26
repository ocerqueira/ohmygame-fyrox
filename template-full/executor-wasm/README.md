# Web build

Build the wasm executor and serve this folder:

```bash
rustup target add wasm32-unknown-unknown
cargo build -p executor-wasm --target wasm32-unknown-unknown --release
wasm-bindgen target/wasm32-unknown-unknown/release/executor_wasm.wasm \
  --out-dir executor-wasm/pkg --target web
```

Then serve `executor-wasm/` with any static server and open `index.html`.
`cargo install wasm-bindgen-cli` provides `wasm-bindgen`. The Start button is
there because some browsers block audio until the page is clicked.
