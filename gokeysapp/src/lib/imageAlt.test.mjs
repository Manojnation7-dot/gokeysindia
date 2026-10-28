import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

// Every image the site's code renders has an alt attribute (alt="" for a purely decorative one).
// Images inside admin content get theirs from the API.
const SRC = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function* jsFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* jsFiles(path);
    else if (/\.(js|jsx)$/.test(entry.name)) yield path;
  }
}

test("every <img> and <Image> in the code has an alt attribute", () => {
  const missing = [];
  for (const file of jsFiles(SRC)) {
    const code = readFileSync(file, "utf8");
    for (const match of code.matchAll(/<(img|Image)\b((?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*)>/g)) {
      if (!/\balt=/.test(match[2])) {
        const line = code.slice(0, match.index).split("\n").length;
        missing.push(`${relative(SRC, file)}:${line}`);
      }
    }
  }
  assert.deepEqual(missing, [], `images without alt: ${missing.join(", ")}`);
});
