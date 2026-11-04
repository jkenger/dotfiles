#!/usr/bin/env node
// Claude Code PreToolUse hook (matcher: Write): warns, never blocks, when a
// brand-new route or feature file is about to be created on a branch that
// has touched zero files under docs/ -- the shape of a feature lifecycle
// chain skip (no specification/technical-design/plan artifact anywhere).
//
// Self-disabling: does nothing in a project that hasn't opted into the
// chain (no docs/architecture/decisions/ folder) or outside a git repo.
// Never blocks: always exits 0. A false positive costs a warning, not a
// stopped edit.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const NEW_FEATURE_PATH = /\/features\/|\/api\/.*route\.(ts|js|tsx|jsx)$/;

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

function repoRoot(file) {
  let dir = path.dirname(path.resolve(file));
  for (;;) {
    if (fs.existsSync(path.join(dir, ".git"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function git(args, cwd) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", timeout: 10000 });
  return result.status === 0 ? result.stdout.trim() : "";
}

function branchTouchedDocs(root) {
  const base =
    git(["merge-base", "HEAD", "main"], root) || git(["merge-base", "HEAD", "origin/main"], root);
  const committed = base ? git(["diff", "--name-only", base, "HEAD", "--", "docs/"], root) : "";
  const uncommitted = git(["status", "--porcelain", "--", "docs/"], root);
  return Boolean(committed || uncommitted);
}

function main() {
  const file = filePathFrom(readStdin());
  if (!file || fs.existsSync(file)) return; // only new-file creation, not a rewrite
  if (!NEW_FEATURE_PATH.test(file.replace(/\\/g, "/"))) return;

  const root = repoRoot(file);
  if (!root) return;
  if (!fs.existsSync(path.join(root, "docs", "architecture", "decisions"))) return; // not chain-adopting

  if (!branchTouchedDocs(root)) {
    process.stderr.write(
      `Chain check: creating ${path.relative(root, file)} looks like new feature work, but no file under docs/ has been touched on this branch yet. If this needs a specification, technical design, or plan first, write it before continuing -- otherwise this decision lands undocumented.\n`,
    );
  }
}

try {
  main();
} catch {
  // Never block an edit.
}
process.exit(0);
