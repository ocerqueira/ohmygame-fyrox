# Fyrox 1.0.1 API cheatsheet

Snippets verified against the `fyrox-impl` 1.0.1 sources. Imports are not all
shown; the compiler names the missing ones. Most things are builders that take
`&mut scene.graph`, and most methods return `GameResult`, so `?` works.

## Entry point (`src/main.rs`)

```rust
use fyrox::{
    core::log::Log,
    engine::executor::Executor,
    event_loop::EventLoop,
};

fn main() {
    Log::set_file_name("game.log");

    let event_loop = EventLoop::new().expect("failed to create the event loop");
    let mut executor = Executor::new(Some(event_loop));
    executor.add_plugin(Game::default());
    executor.run();
}
```

## Plugin with the scene handle

Scenes load in the background. `load_scene_or_ui` adds the scene but gives no
handle back; `load_scene` with a callback does.

```rust
use fyrox::{
    core::{pool::Handle, reflect::prelude::*, visitor::prelude::*},
    plugin::{error::GameResult, Plugin, PluginContext},
    scene::Scene,
};

#[derive(Default, Visit, Reflect, Debug)]
#[reflect(non_cloneable)]
pub struct Game {
    scene: Handle<Scene>,
}

impl Plugin for Game {
    fn init(&mut self, scene_path: Option<&str>, mut context: PluginContext) -> GameResult {
        let path = scene_path.unwrap_or("data/scene.rgs").to_string();
        context.load_scene(path, false, |result, game: &mut Game, ctx| {
            let scene = result?.payload;
            // The scene is ready here: find nodes, add scripts, read the camera.
            game.scene = ctx.scenes.add(scene);
            Ok(())
        });
        Ok(())
    }

    fn update(&mut self, context: &mut PluginContext) -> GameResult {
        let scene = context.scenes.try_get(self.scene)?;
        let _root = scene.graph.root();
        Ok(())
    }
}
```

`Plugin` methods: `register`, `init`, `on_loaded`, `on_deinit`, `update`,
`post_update`, `on_os_event`, `on_ui_message`, `before_rendering`,
`on_graphics_context_initialized`, `on_graphics_context_destroyed`,
`on_game_error`. `update` runs at a fixed rate (`context.dt` seconds).

## Input and moving a node

```rust
use fyrox::{core::algebra::Vector3, keyboard::KeyCode};

fn update(&mut self, context: &mut PluginContext) -> GameResult {
    let speed = 3.0 * context.dt;
    let mut offset = Vector3::default();
    if context.input_state.is_key_down(KeyCode::KeyW) {
        offset.z -= speed;
    }
    if context.input_state.is_key_down(KeyCode::KeyS) {
        offset.z += speed;
    }
    if context.input_state.is_key_down(KeyCode::KeyA) {
        offset.x -= speed;
    }
    if context.input_state.is_key_down(KeyCode::KeyD) {
        offset.x += speed;
    }

    let graph = &mut context.scenes[self.scene].graph;
    let camera = graph.find_handle_by_name_from_root("Camera");
    if camera.is_some() {
        graph[camera].local_transform_mut().offset(offset);
    }
    Ok(())
}
```

`is_key_pressed` / `is_key_released` report the change in this frame.
`on_os_event` gets `Event::WindowEvent` for the mouse, the window and keys.

## The starter scene

`data/scene.rgs` has a `Cube` mesh, a `Camera` and a `SpotLight`. Nodes are found
by name:

```rust
let graph = &mut context.scenes[self.scene].graph;
let cube = graph.find_handle_by_name_from_root("Cube");
if cube.is_some() {
    graph[cube].local_transform_mut().set_rotation(
        UnitQuaternion::from_axis_angle(&Vector3::y_axis(), 1.0),
    );
}
```

## Building a scene in code

```rust
use fyrox::{
    core::algebra::{Matrix4, Vector3},
    scene::{
        base::BaseBuilder,
        camera::{CameraBuilder, PerspectiveProjection, Projection},
        light::{point::PointLightBuilder, BaseLightBuilder},
        mesh::{
            surface::{SurfaceBuilder, SurfaceData, SurfaceResource},
            MeshBuilder,
        },
        transform::TransformBuilder,
        Scene,
    },
};

let mut scene = Scene::new();

CameraBuilder::new(BaseBuilder::new().with_local_transform(
    TransformBuilder::new()
        .with_local_position(Vector3::new(0.0, 2.0, -5.0))
        .build(),
))
.with_projection(Projection::Perspective(PerspectiveProjection {
    fov: 60.0f32.to_radians(),
    z_near: 0.05,
    z_far: 1000.0,
}))
.build(&mut scene.graph);

PointLightBuilder::new(BaseLightBuilder::new(BaseBuilder::new().with_local_transform(
    TransformBuilder::new()
        .with_local_position(Vector3::new(0.0, 3.0, 0.0))
        .build(),
)))
.with_radius(6.0)
.build(&mut scene.graph);

let cube_surface = SurfaceBuilder::new(SurfaceResource::new_embedded(
    SurfaceData::make_cube(Matrix4::identity()),
))
.build();

MeshBuilder::new(BaseBuilder::new())
    .with_surfaces(vec![cube_surface])
    .build(&mut scene.graph);

// Register the scene with the engine.
let scene_handle = context.scenes.add(scene);
```

For a 2D game use an orthographic camera
(`Projection::Orthographic(OrthographicProjection { z_near, z_far, vertical_size })`)
and `scene::dim2::rectangle::RectangleBuilder` or `scene::sprite::SpriteBuilder`
instead of meshes.

## Scripts (per-node behaviour)

```rust
use fyrox::{
    core::{reflect::prelude::*, type_traits::prelude::*, visitor::prelude::*},
    keyboard::KeyCode,
    plugin::error::GameResult,
    script::{ScriptContext, ScriptTrait},
};

#[derive(Visit, Reflect, Default, Debug, Clone, TypeUuidProvider, ComponentProvider)]
#[type_uuid(id = "6f0c3d38-3a3c-4b31-9c9e-1a2f0f4d7a11")]
#[visit(optional)]
pub struct Player {
    pub speed: f32,
}

impl ScriptTrait for Player {
    fn on_update(&mut self, ctx: &mut ScriptContext) -> GameResult {
        let speed = if self.speed > 0.0 { self.speed } else { 3.0 } * ctx.dt;
        let mut offset = Vector3::default();
        if ctx.input_state.is_key_down(KeyCode::KeyW) {
            offset.z -= speed;
        }
        if ctx.input_state.is_key_down(KeyCode::KeyS) {
            offset.z += speed;
        }
        ctx.scene.graph[ctx.handle].local_transform_mut().offset(offset);
        Ok(())
    }
}
```

Register it once, in the plugin:

```rust
fn register(&self, context: PluginRegistrationContext) -> GameResult {
    context
        .serialization_context
        .script_constructors
        .add::<Player>("Player");
    Ok(())
}
```

Then attach it, in the load callback or from an editor-made scene:

```rust
let player = graph.find_handle_by_name_from_root("Player");
if player.is_some() {
    graph[player].add_script(Player::default());
}
```

Every script needs a unique UUID (generate one per script), `Default`, and the
derives above; without registration a script cannot be saved with the scene.
`ScriptContext` gives `scene`, `handle`, `dt`, `input_state`, `resource_manager`,
`user_interfaces`, `plugins`.

## UI (retained mode, built once)

```rust
use fyrox::{
    core::algebra::Vector2,
    gui::{text::TextBuilder, widget::WidgetBuilder},
};

let ui = context.user_interfaces.first_mut();
let mut build_ctx = ui.build_ctx();
TextBuilder::new(
    WidgetBuilder::new().with_desired_position(Vector2::new(24.0, 24.0)),
)
.with_text("Pontos: 0")
.build(&mut build_ctx);
```

Builders return widget handles; to change a widget later, keep the handle and
send it a message (see `fyrox-ui/src/text.rs`, `fyrox-ui/src/button.rs`) instead
of editing the tree. Clicks arrive in `Plugin::on_ui_message` as `UiMessage`.

## Materials and textures

```rust
use fyrox::{
    core::sstorage::ImmutableString,
    material::{Material, MaterialResource, PropertyValue},
    resource::texture::Texture,
};

let texture = context.resource_manager.request::<Texture>("data/grass.png");
let mut material = Material::standard();
material
    .set_property(
        &ImmutableString::new("diffuseTexture"),
        PropertyValue::Sampler {
            value: Some(texture),
            fallback: Default::default(),
        },
    )
    .unwrap();
let material = MaterialResource::new_embedded(material);
// SurfaceBuilder::new(...).with_material(material).build()
```

`Material::standard()` is the 3D material, `standard_2d()`, `standard_sprite()`
and `standard_particle_system()` exist too. Assets are requested by a path
relative to the project folder (`data/...`), never an absolute path.

## Sound

```rust
use fyrox::scene::sound::{SoundBuffer, SoundBuilder};

let buffer = context.resource_manager.request::<SoundBuffer>("data/click.ogg");
SoundBuilder::new(BaseBuilder::new())
    .with_buffer(Some(buffer))
    .with_play_once(true)
    .build(&mut scene.graph);
```

## Physics

```rust
use fyrox::scene::{
    collider::{ColliderBuilder, ColliderShape, CuboidShape},
    rigidbody::{RigidBodyBuilder, RigidBodyType},
};

RigidBodyBuilder::new(BaseBuilder::new())
    .with_body_type(RigidBodyType::Dynamic)
    .with_mass(1.0)
    .build(&mut scene.graph);

ColliderBuilder::new(BaseBuilder::new())
    .with_shape(ColliderShape::Cuboid(CuboidShape {
        half_extents: Vector3::new(0.5, 0.5, 0.5),
    }))
    .build(&mut scene.graph);
```

With a model, load it with
`context.resource_manager.request::<Model>("data/model.fbx")` and instantiate it
into the scene (`Model::instantiate`).

## Quit and update rate

`context.loop_controller.exit()` closes the app (for example on `KeyCode::Escape`).
`Executor::set_desired_update_rate(60.0)` before `run()` changes the fixed update
rate; `context.performance_statistics` has the last frame's numbers.
