//! The game plugin: global state and the game loop.

#[allow(unused_imports)]
use fyrox::graph::prelude::*;
use fyrox::{
    core::pool::Handle,
    core::reflect::prelude::*,
    core::visitor::prelude::*,
    event::Event,
    gui::{message::UiMessage, UserInterface},
    plugin::{error::GameResult, Plugin, PluginContext, PluginRegistrationContext},
};

/// Global game state: scene handles, the player, scores, UI.
#[derive(Default, Visit, Reflect, Debug)]
#[reflect(non_cloneable)]
pub struct Game {
    // Add fields here, such as a handle to the scene or to the player node.
}

impl Plugin for Game {
    fn register(&self, _context: PluginRegistrationContext) -> GameResult {
        // Register scripts so scenes can use them:
        // _context.serialization_context.script_constructors
        //     .add::<Player>("Player");
        Ok(())
    }

    fn init(&mut self, scene_path: Option<&str>, mut context: PluginContext) -> GameResult {
        // Loads the scene in the background; the game shows it when it is ready.
        context.load_scene_or_ui::<Self>(scene_path.unwrap_or("data/scene.rgs"));
        Ok(())
    }

    fn update(&mut self, _context: &mut PluginContext) -> GameResult {
        // Runs at a fixed rate: movement, rules, timers.
        Ok(())
    }

    fn on_os_event(&mut self, _event: &Event<()>, _context: PluginContext) -> GameResult {
        // Keyboard, mouse and window events.
        Ok(())
    }

    fn on_ui_message(
        &mut self,
        _context: &mut PluginContext,
        _message: &UiMessage,
        _ui_handle: Handle<UserInterface>,
    ) -> GameResult {
        // Clicks and other UI events.
        Ok(())
    }

    fn on_deinit(&mut self, _context: PluginContext) -> GameResult {
        // Clean up here.
        Ok(())
    }
}
