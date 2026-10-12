#!/usr/bin/env node
// Claude Code PostToolUse hook: formats the file Claude just wrote with the
// project's own Prettier. No dependencies, no output, always exits 0, so a
// formatting problem never blocks an edit.
//
// Skips the file when:
//   - the project has no local Prettier (node_modules/prettier)
//   - the project uses Biome or dprint (biome.json, biome.jsonc, dprint.json)
// Both are looked for by walking up from the file to the repo root.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const OTHER_FORMATTERS = ["biome.json", "biome.jsonc", "dprint.json"];
const TIMEOUT_MS = 25000; // under the hook's 30s limit

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function filePathFrom(input) {
  try {
    const data = JSON.parse(input);
    const file = data && data.tool_input && data.tool_input.file_path;
    return typeof file === "string" && file.length > 0 ? file : null;
  } catch {
    return null;
  }
}

// Folders from the file's folder up to the repo root (the first folder with a
// .git entry), or up to the filesystem root when the file is not in a repo.
function foldersUpToRepoRoot(file) {
  const folders = [];
  let dir = path.dirname(path.resolve(file));
  for (;;) {
    folders.push(dir);
    if (fs.existsSync(path.join(dir, ".git"))) break;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return folders;
}

function findPrettierRoot(folders) {
  for (const dir of folders) {
    if (OTHER_FORMATTERS.some((name) => fs.existsSync(path.join(dir, name)))) {
      return null;
    }
  }
  return (
    folders.find((dir) =>
      fs.existsSync(path.join(dir, "node_modules", "prettier", "package.json")),
    ) || null
  );
}

function runPrettier(file, cwd) {
  const args = ["--no-install", "prettier", "--write", "--ignore-unknown"];
  if (process.platform === "win32") {
    // npx is a .cmd file on Windows, which needs a shell. Quote the path for
    // cmd.exe, and skip names cmd.exe would still rewrite inside quotes.
    if (/["%]/.test(file)) return;
    spawnSync(`npx ${args.join(" ")} "${file}"`, {
      cwd,
      shell: true,
      stdio: "ignore",
      timeout: TIMEOUT_MS,
      windowsHide: true,
    });
  } else {
    spawnSync("npx", [...args, file], {
      cwd,
      stdio: "ignore",
      timeout: TIMEOUT_MS,
    });
  }
}

function main() {
  const file = filePathFrom(readStdin());
  if (!file || !fs.existsSync(file)) return;
  const prettierRoot = findPrettierRoot(foldersUpToRepoRoot(file));
  if (!prettierRoot) return;
  runPrettier(path.resolve(file), prettierRoot);
}

try {
  main();
} catch {
  // Never block an edit.
}
process.exit(0);
