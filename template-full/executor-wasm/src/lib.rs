//! Executor with the game connected to it as a plugin (web build).
#![cfg(target_arch = "wasm32")]

use fyrox::core::wasm_bindgen::{self, prelude::*};
use fyrox::engine::executor::Executor;
use fyrox::event_loop::EventLoop;
use game::Game;

#[wasm_bindgen]
pub fn main() {
    let mut executor = Executor::new(Some(EventLoop::new().unwrap()));
    executor.add_plugin(Game::default());
    executor.run()
}
