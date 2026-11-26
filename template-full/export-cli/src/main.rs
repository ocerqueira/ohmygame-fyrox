//! Exporter command line interface (CLI) with the game connected to it as a plugin.
//! This tool can be used to automate project export in CI/CD.
//! Usage: `cargo run -p export-cli -- --target-platform pc`
//!     or `cargo run -p export-cli -- --help` for the docs.

use fyrox::core::log::Log;
use fyrox::engine::executor::Executor;
use fyrox::event_loop::EventLoop;
use fyrox_build_tools::export::cli_export;

fn main() {
    Log::set_file_name("gameExport.log");
    let mut executor = Executor::new(EventLoop::new().ok());
    executor.add_plugin(game::Game::default());
    cli_export(executor.resource_manager.clone())
}
