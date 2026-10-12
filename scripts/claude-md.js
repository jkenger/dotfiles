#!/usr/bin/env node
// Keeps the repo copy of my global CLAUDE.md in step with ~/.claude/CLAUDE.md.
// No dependencies. Symlinks are blocked on my Windows machine, so this copies.
//
//   node scripts/claude-md.js status    say whether the two copies differ
//   node scripts/claude-md.js save      copy ~/.claude/CLAUDE.md into the repo
//   node scripts/claude-md.js install   copy the repo file into ~/.claude (backup first)
//
// Line endings are ignored when comparing, because git may check the repo
// copy out with CRLF. The live file is always written with LF.
//
// Exit codes: 0 same or done, 1 different (status only), 2 error.

const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO_FILE = path.join(__dirname, "..", "claude", ".claude", "CLAUDE.md");
const LIVE_FILE = path.join(
  process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"),
  "CLAUDE.md",
);

const toLf = (text) => text.replace(/\r\n/g, "\n");

function read(file) {
  return fs.existsSync(file) ? toLf(fs.readFileSync(file, "utf8")) : null;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function status() {
  const live = read(LIVE_FILE);
  const repo = read(REPO_FILE);
  if (live === null) return fail(`No live file at ${LIVE_FILE}`);
  if (repo === null) return fail(`No repo file at ${REPO_FILE}. Run save first`);
  if (live === repo) {
    console.log("Same");
    return 0;
  }
  console.log("Different. Run save to keep your live edits, or install to restore the repo version");
  return 1;
}

function save() {
  const live = read(LIVE_FILE);
  if (live === null) return fail(`No live file at ${LIVE_FILE}`);
  if (live === read(REPO_FILE)) {
    console.log("Already saved");
    return 0;
  }
  fs.writeFileSync(REPO_FILE, live);
  console.log(`Saved to ${path.relative(process.cwd(), REPO_FILE)}. Commit it to track the change`);
  return 0;
}

function install() {
  const repo = read(REPO_FILE);
  if (repo === null) return fail(`No repo file at ${REPO_FILE}`);
  const live = read(LIVE_FILE);
  if (live === repo) {
    console.log("Already installed");
    return 0;
  }
  if (live !== null) {
    const backup = `${LIVE_FILE}.bak-${timestamp()}`;
    fs.copyFileSync(LIVE_FILE, backup);
    console.log(`Backed up the old file to ${backup}`);
  }
  fs.mkdirSync(path.dirname(LIVE_FILE), { recursive: true });
  fs.writeFileSync(LIVE_FILE, repo);
  console.log(`Installed to ${LIVE_FILE}`);
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
