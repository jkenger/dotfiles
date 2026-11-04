#!/usr/bin/env node
// Measures the per-session context cost and on-disk size of ~/.claude/skills.
// Run before and after deleting unused skills to see the before/after numbers
// in docs/skills-cleanup-benchmark.md instead of guessing at the saving.
//
// Cost model: every skill's `name` + `description` from its SKILL.md frontmatter
// gets injected into the system prompt's "available skills" list every session,
// whether the skill is ever invoked or not. That's the real recurring cost;
// folder size only matters for disk, since the rest of a skill (SKILL.md body,
// resources/) loads lazily only when invoked.
//
// shortcut: chars/4 is a rough token estimate, not a tokenizer count; good
// enough to compare before vs after, not for billing-accurate numbers.

const fs = require("fs");
const path = require("path");
const os = require("os");

const SKILLS_DIR = path.join(os.homedir(), ".claude", "skills");

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(full);
    else total += fs.statSync(full).size;
  }
  return total;
}

function frontmatterField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+(?:\\n(?!\\w+:)[^\\n]*)*)`, "m"));
  return m ? m[1].trim() : "";
}

function main() {
  const skills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const rows = [];
  for (const name of skills) {
    const skillMd = path.join(SKILLS_DIR, name, "SKILL.md");
    if (!fs.existsSync(skillMd)) continue;
    const text = fs.readFileSync(skillMd, "utf-8");
    const description = frontmatterField(text, "description");
    const listingChars = name.length + description.length;
    const bytes = dirSize(path.join(SKILLS_DIR, name));
    rows.push({ name, listingChars, bytes });
  }

  const totalListingChars = rows.reduce((s, r) => s + r.listingChars, 0);
  const totalBytes = rows.reduce((s, r) => s + r.bytes, 0);

  if (rows.length === 0) {
    throw new Error(`No skills with a readable SKILL.md found under ${SKILLS_DIR}`);
  }

  const result = {
    measuredAt: new Date().toISOString(),
    skillCount: rows.length,
    totalListingChars,
    approxTokensPerSession: Math.round(totalListingChars / 4),
    totalBytesOnDisk: totalBytes,
    rows,
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
