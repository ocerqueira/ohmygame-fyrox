//! Starts the game: the engine runs the `Game` plugin in its own window.

use fyrox::core::log::Log;
use fyrox::engine::executor::Executor;
use fyrox::event_loop::EventLoop;

mod game;

fn main() {
    Log::set_file_name("game.log");

    let event_loop = EventLoop::new().expect("failed to create the event loop");
    let mut executor = Executor::new(Some(event_loop));
    executor.add_plugin(game::Game::default());
    executor.run();
}
