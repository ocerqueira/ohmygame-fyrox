<#
  Copy the OhMyGame plugin draft into this repository.

  The Plugin Builder workspace is the working copy; this repository is a synced
  copy of it. Pass the draft folder, for example:

    powershell -ExecutionPolicy Bypass -File .\sync.ps1 -Source "C:\Users\<you>\AppData\Roaming\ohmygame\data\plugin-setup\<session>\workspace\fyrox"

  Only the package items below are replaced, so .git, this script and the other
  repository files stay as they are. Review with `git status`, then commit and push.
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Source
)

$ErrorActionPreference = "Stop"
$dest = $PSScriptRoot

if (-not (Test-Path (Join-Path $Source ".ohmygame-plugin\plugin.json"))) {
  throw "$Source does not look like the plugin draft (no .ohmygame-plugin/plugin.json)"
}

$directories = @(
  ".ohmygame-plugin",
  "assets",
  "locales",
  "native",
  "panel",
  "skills",
  "template",
  "template-full",
  "tools"
)

foreach ($dir in $directories) {
  $from = Join-Path $Source $dir
  $to = Join-Path $dest $dir
  if (-not (Test-Path $from)) { throw "Missing $from" }
  if (Test-Path $to) { Remove-Item $to -Recurse -Force }
  Copy-Item $from $to -Recurse -Force
}

foreach ($file in @("LICENSE", "README.md")) {
  Copy-Item (Join-Path $Source $file) (Join-Path $dest $file) -Force
}

Write-Host "Synced from $Source"
Write-Host "Next: git status, git add -A, git commit -m '...', git push"
