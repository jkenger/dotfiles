#!/usr/bin/env node
// Keeps the repo copies of my global Claude config in step with ~/.claude/.
// No dependencies. Symlinks are blocked on my Windows machine, so this copies.
//
//   node scripts/claude-md.js status    say whether any copies differ
//   node scripts/claude-md.js save      copy the live files into the repo
//   node scripts/claude-md.js install   copy the repo files into ~/.claude (backup first)
//
// Covers two kinds of target:
//   - a single file (CLAUDE.md, PRODUCT.md, ...)
//   - a whole directory, compared and copied file by file (commands/, agents/, skills/)
//
// skills/tdd, skills/codebase-design, and skills/debugging are excluded —
// they duplicate the mattpocock plugin, per the README's install step.
//
// Line endings are ignored when comparing, because git may check the repo
// copy out with CRLF. The live file is always written with LF.
//
// Exit codes: 0 same or done, 1 different (status only), 2 error.

const fs = require("fs");
const os = require("os");
const path = require("path");

const CLAUDE_DIR = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
const REPO_DIR = path.join(__dirname, "..", "claude", ".claude");

const SKIP_SKILLS = new Set(["tdd", "codebase-design", "debugging"]);

const TARGETS = [
  { type: "file", name: "CLAUDE.md" },
  { type: "file", name: "PRODUCT.md" },
  { type: "file", name: "DESIGN.md" },
  { type: "file", name: "how-to-write.md" },
  { type: "file", name: "default-visual-system.md" },
  { type: "dir", name: "commands" },
  { type: "dir", name: "agents" },
  { type: "dir", name: "skills", exclude: SKIP_SKILLS },
];

const toLf = (text) => text.replace(/\r\n/g, "\n");

function read(file) {
  if (!fs.existsSync(file)) return null;
  if (fs.statSync(file).isDirectory()) return null;
  return toLf(fs.readFileSync(file, "utf8"));
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

// Relative file paths under `dir`, skipping any top-level entry named in `exclude`.
function listFiles(dir, exclude) {
  const result = [];
  function walk(current, rel) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryRel = rel ? path.join(rel, entry.name) : entry.name;
      const top = rel ? rel.split(path.sep)[0] : entry.name;
      if (exclude && exclude.has(top)) continue;
      const entryAbs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(entryAbs, entryRel);
      } else {
        result.push(entryRel);
      }
    }
  }
  if (fs.existsSync(dir)) walk(dir, "");
  return result;
}

function statusFile(name) {
  const liveFile = path.join(CLAUDE_DIR, name);
  const repoFile = path.join(REPO_DIR, name);
  const live = read(liveFile);
  const repo = read(repoFile);
  if (live === null) return fail(`No live file at ${liveFile}`);
  if (repo === null) return fail(`No repo file at ${repoFile}. Run save first`);
  if (live === repo) {
    console.log(`Same: ${name}`);
    return 0;
  }
  console.log(`Different: ${name}`);
  return 1;
}

function statusDir({ name, exclude }) {
  const liveDir = path.join(CLAUDE_DIR, name);
  const repoDir = path.join(REPO_DIR, name);
  const liveFiles = new Set(listFiles(liveDir, exclude));
  const repoFiles = new Set(listFiles(repoDir, exclude));
  const all = new Set([...liveFiles, ...repoFiles]);
  let anyDifferent = false;
  for (const rel of all) {
    const live = read(path.join(liveDir, rel));
    const repo = read(path.join(repoDir, rel));
    const label = `${name}/${rel}`;
    if (live === null) {
      console.log(`Only in repo: ${label}`);
      anyDifferent = true;
    } else if (repo === null) {
      console.log(`Only live, not in repo: ${label}`);
      anyDifferent = true;
    } else if (live !== repo) {
      console.log(`Different: ${label}`);
      anyDifferent = true;
    }
  }
  if (!anyDifferent) console.log(`Same: ${name}/`);
  return anyDifferent ? 1 : 0;
}

function status() {
  let anyDifferent = false;
  for (const target of TARGETS) {
    const result = target.type === "file" ? statusFile(target.name) : statusDir(target);
    if (result === 2) return 2;
    if (result === 1) anyDifferent = true;
  }
  if (anyDifferent) {
    console.log("Run save to keep your live edits, or install to restore the repo versions");
  }
  return anyDifferent ? 1 : 0;
}

function saveFile(name) {
  const liveFile = path.join(CLAUDE_DIR, name);
  const repoFile = path.join(REPO_DIR, name);
  const live = read(liveFile);
  if (live === null) return fail(`No live file at ${liveFile}`);
  if (live === read(repoFile)) {
    console.log(`Already saved: ${name}`);
    return 0;
  }
  fs.writeFileSync(repoFile, live);
  console.log(`Saved ${name} to ${path.relative(process.cwd(), repoFile)}`);
  return 0;
}

function saveDir({ name, exclude }) {
  const liveDir = path.join(CLAUDE_DIR, name);
  const repoDir = path.join(REPO_DIR, name);
  const liveFiles = listFiles(liveDir, exclude);
  let onlyInRepo = 0;
  for (const rel of listFiles(repoDir, exclude)) {
    if (!fs.existsSync(path.join(liveDir, rel))) onlyInRepo++;
  }
  let saved = 0;
  for (const rel of liveFiles) {
    const live = read(path.join(liveDir, rel));
    const repoFile = path.join(repoDir, rel);
    if (live === read(repoFile)) continue;
    fs.mkdirSync(path.dirname(repoFile), { recursive: true });
    fs.writeFileSync(repoFile, live);
    saved++;
  }
  console.log(saved > 0 ? `Saved ${saved} file(s) under ${name}/` : `Already saved: ${name}/`);
  if (onlyInRepo > 0) {
    console.log(`${onlyInRepo} file(s) exist only in the repo under ${name}/ — not deleted, review by hand`);
  }
  return 0;
}

function save() {
  for (const target of TARGETS) {
    const result = target.type === "file" ? saveFile(target.name) : saveDir(target);
    if (result === 2) return 2;
  }
  console.log("Commit the repo changes to track them");
  return 0;
}

function installFile(name) {
  const liveFile = path.join(CLAUDE_DIR, name);
  const repoFile = path.join(REPO_DIR, name);
  const repo = read(repoFile);
  if (repo === null) return fail(`No repo file at ${repoFile}`);
  const live = read(liveFile);
  if (live === repo) {
    console.log(`Already installed: ${name}`);
    return 0;
  }
  if (live !== null) {
    const backup = `${liveFile}.bak-${timestamp()}`;
    fs.copyFileSync(liveFile, backup);
    console.log(`Backed up the old ${name} to ${backup}`);
  }
  fs.mkdirSync(path.dirname(liveFile), { recursive: true });
  fs.writeFileSync(liveFile, repo);
  console.log(`Installed ${name} to ${liveFile}`);
  return 0;
}

function installDir({ name, exclude }) {
  const liveDir = path.join(CLAUDE_DIR, name);
  const repoDir = path.join(REPO_DIR, name);
  const repoFiles = listFiles(repoDir, exclude);
  if (repoFiles.length === 0) return fail(`No repo files under ${repoDir}`);

  const toChange = [];
  for (const rel of repoFiles) {
    const repo = read(path.join(repoDir, rel));
    const liveFile = path.join(liveDir, rel);
    if (read(liveFile) !== repo) toChange.push(rel);
  }
  if (toChange.length === 0) {
    console.log(`Already installed: ${name}/`);
    return 0;
  }

  // Back up only the files about to change, one at a time. A whole-directory
  // cpSync backup fails here with EPERM on Windows (observed on agents/),
  // even when nothing in the tree is a visible symlink.
  const ts = timestamp();
  let backedUp = 0;
  for (const rel of toChange) {
    const liveFile = path.join(liveDir, rel);
    if (fs.existsSync(liveFile)) {
      fs.copyFileSync(liveFile, `${liveFile}.bak-${ts}`);
      backedUp++;
    }
  }
  if (backedUp > 0) {
    console.log(`Backed up ${backedUp} old file(s) under ${name}/ (suffix .bak-${ts})`);
  }
  for (const rel of toChange) {
    const repo = read(path.join(repoDir, rel));
    const liveFile = path.join(liveDir, rel);
    fs.mkdirSync(path.dirname(liveFile), { recursive: true });
    fs.writeFileSync(liveFile, repo);
  }
  console.log(`Installed ${toChange.length} file(s) to ${liveDir}`);
  return 0;
}

function install() {
  for (const target of TARGETS) {
    const result = target.type === "file" ? installFile(target.name) : installDir(target);
    if (result === 2) return 2;
  }
  return 0;
}

function fail(message) {
  console.error(message);
  return 2;
}

const commands = { status, save, install };
const command = commands[process.argv[2]];
if (!command) {
  console.error("Usage: node scripts/claude-md.js status|save|install");
  process.exit(2);
}
process.exit(command());
