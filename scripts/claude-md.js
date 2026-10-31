#!/usr/bin/env node
// Keeps the repo copies of my global Claude config files in step with ~/.claude/.
// No dependencies. Symlinks are blocked on my Windows machine, so this copies.
//
//   node scripts/claude-md.js status    say whether any copies differ
//   node scripts/claude-md.js save      copy the live files into the repo
//   node scripts/claude-md.js install   copy the repo files into ~/.claude (backup first)
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

const FILES = ["CLAUDE.md", "PRODUCT.md", "DESIGN.md", "how-to-write.md", "default-visual-system.md"];

const toLf = (text) => text.replace(/\r\n/g, "\n");

function read(file) {
  return fs.existsSync(file) ? toLf(fs.readFileSync(file, "utf8")) : null;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function status() {
  let anyDifferent = false;
  for (const name of FILES) {
    const liveFile = path.join(CLAUDE_DIR, name);
    const repoFile = path.join(REPO_DIR, name);
    const live = read(liveFile);
    const repo = read(repoFile);
    if (live === null) return fail(`No live file at ${liveFile}`);
    if (repo === null) return fail(`No repo file at ${repoFile}. Run save first`);
    if (live === repo) {
      console.log(`Same: ${name}`);
    } else {
      console.log(`Different: ${name}`);
      anyDifferent = true;
    }
  }
  if (anyDifferent) {
    console.log("Run save to keep your live edits, or install to restore the repo versions");
  }
  return anyDifferent ? 1 : 0;
}

function save() {
  for (const name of FILES) {
    const liveFile = path.join(CLAUDE_DIR, name);
    const repoFile = path.join(REPO_DIR, name);
    const live = read(liveFile);
    if (live === null) return fail(`No live file at ${liveFile}`);
    if (live === read(repoFile)) {
      console.log(`Already saved: ${name}`);
      continue;
    }
    fs.writeFileSync(repoFile, live);
    console.log(`Saved ${name} to ${path.relative(process.cwd(), repoFile)}`);
  }
  console.log("Commit the repo changes to track them");
  return 0;
}

function install() {
  for (const name of FILES) {
    const liveFile = path.join(CLAUDE_DIR, name);
    const repoFile = path.join(REPO_DIR, name);
    const repo = read(repoFile);
    if (repo === null) return fail(`No repo file at ${repoFile}`);
    const live = read(liveFile);
    if (live === repo) {
      console.log(`Already installed: ${name}`);
      continue;
    }
    if (live !== null) {
      const backup = `${liveFile}.bak-${timestamp()}`;
      fs.copyFileSync(liveFile, backup);
      console.log(`Backed up the old ${name} to ${backup}`);
    }
    fs.mkdirSync(path.dirname(liveFile), { recursive: true });
    fs.writeFileSync(liveFile, repo);
    console.log(`Installed ${name} to ${liveFile}`);
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
