# Developing this plugin

The source in this repository is a synced copy of the OhMyGame Plugin Builder
draft. Edit and preview the plugin in the builder, then copy it here:

```powershell
powershell -ExecutionPolicy Bypass -File .\sync.ps1 -Source "C:\Users\<you>\AppData\Roaming\ohmygame\data\plugin-setup\<session>\workspace\fyrox"
```

Review `git status` and `git diff`, then commit and push. Raise `version` in
`.ohmygame-plugin/plugin.json` for each release and add its notes to
`CHANGELOG.md`.

The builder checks the package (`prepare`), but also:

- install it and try both project types in a project;
- look at the panel at a narrow width and in the light theme;
- keep the MIT license and the Fyrox template credit.

## Layout

- `.ohmygame-plugin/` — manifest.
- `panel/`, `native/` — the page and the code it runs.
- `skills/fyrox/` — the agent Skill and its references.
- `template/` — lean single-crate project.
- `template-full/` — official workspace (game, executor, editor, hot reload,
  web and Android executors, export CLI).
- `assets/`, `locales/`, `README.md`, `LICENSE`.
