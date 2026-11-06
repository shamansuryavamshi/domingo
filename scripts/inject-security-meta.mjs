#!/usr/bin/env node
// Injects CSP + Referrer-Policy meta tags into every exported HTML file.
// These are meta-tag fallbacks only; they are not equivalent to HTTP headers.
// Usage:
//   node scripts/inject-security-meta.mjs            # inject, then verify
//   node scripts/inject-security-meta.mjs --verify   # verify only

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(SCRIPT_DIR, "..", "out");

const CSP_CONTENT =
  "default-src 'self'; base-uri 'self'; object-src 'none'; " +
  "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self'; font-src 'self'; connect-src 'self'; " +
  "form-action 'self'; upgrade-insecure-requests";

export const CSP_TAG = `<meta http-equiv="Content-Security-Policy" content="${CSP_CONTENT}">`;
export const REFERRER_TAG = '<meta name="referrer" content="strict-origin-when-cross-origin">';

const HEAD_OPEN_RE = /<head\b[^>]*>/i;
const HEAD_CLOSE_RE = /<\/head\s*>/i;
const CHARSET_RE = /<meta\b[^>]*\bcharset\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+)[^>]*>/i;
const CSP_META_RE = /<meta\b[^>]*\bhttp-equiv\s*=\s*(?:"\s*Content-Security-Policy\s*"|'\s*Content-Security-Policy\s*'|Content-Security-Policy\b)[^>]*>/gi;
const REFERRER_META_RE = /<meta\b[^>]*\bname\s*=\s*(?:"\s*referrer\s*"|'\s*referrer\s*'|referrer\b)[^>]*>/gi;
const SCRIPT_RE = /<script\b/i;
const LINK_RE = /<link\b/i;
const STYLE_RE = /<style\b/i;

// Elements whose contents are raw text (or RCDATA) and must never be treated
// as markup. Masking these regions prevents meta-like text inside scripts,
// styles, titles, etc. from being mistaken for real tags.
const RAW_TEXT_ELEMENTS = new Set([
  "script",
  "style",
  "textarea",
  "title",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "noscript",
  "plaintext",
]);

function readTag(html, start) {
  let i = start + 1;
  let closing = false;
  if (html[i] === "/") {
    closing = true;
    i++;
  }
  while (i < html.length && /\s/.test(html[i])) i++;
  const nameStart = i;
  while (i < html.length && /[A-Za-z0-9:_-]/.test(html[i])) i++;
  const name = html.slice(nameStart, i).toLowerCase();
  if (!name) return null;

  let quote = null;
  while (i < html.length) {
    const ch = html[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ">") {
      return { name, start, end: i + 1, closing };
    }
    i++;
  }
  return { name, start, end: html.length, closing };
}

// Returns a copy of the HTML with comments and raw-text element contents
// replaced by spaces. Indices are preserved so matches can be mapped back to
// the original string.
export function maskHtml(html) {
  const ignored = new Uint8Array(html.length);
  const mark = (from, to) => {
    for (let i = from; i < to; i++) ignored[i] = 1;
  };

  let i = 0;
  while (i < html.length) {
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i + 4);
      const stop = end === -1 ? html.length : end + 3;
      mark(i, stop);
      i = stop;
      continue;
    }

    if (html[i] === "<") {
      const tag = readTag(html, i);
      if (tag && !tag.closing && RAW_TEXT_ELEMENTS.has(tag.name)) {
        if (tag.name === "plaintext") {
          mark(tag.end, html.length);
          i = html.length;
          continue;
        }

        const closeRe = new RegExp(`</${tag.name}\\s*>`, "ig");
        closeRe.lastIndex = tag.end;
        const close = closeRe.exec(html);
        const contentEnd = close ? close.index : html.length;
        mark(tag.end, contentEnd);
        i = close ? close.index + close[0].length : html.length;
        continue;
      }
      i = tag ? tag.end : i + 1;
      continue;
    }

    i++;
  }

  const chars = html.split("");
  for (let j = 0; j < chars.length; j++) {
    if (ignored[j]) chars[j] = " ";
  }
  return chars.join("");
}

function allMatches(re, text) {
  const matches = [];
  for (const match of text.matchAll(new RegExp(re.source, re.flags))) {
    matches.push({ start: match.index, end: match.index + match[0].length });
  }
  return matches;
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = 0;
  while ((index = haystack.indexOf(needle, index)) !== -1) {
    count++;
    index += needle.length;
  }
  return count;
}

// Removes real (non-commented, non-script) CSP and referrer meta tags.
// Tags that only exist inside comments or raw-text elements are left alone.
function stripSecurityMetas(html) {
  const masked = maskHtml(html);
  const ranges = [
    ...allMatches(CSP_META_RE, masked),
    ...allMatches(REFERRER_META_RE, masked),
  ].sort((a, b) => a.start - b.start);

  if (ranges.length === 0) return html;

  let result = "";
  let cursor = 0;
  for (const range of ranges) {
    if (range.start < cursor) continue;
    result += html.slice(cursor, range.start);
    cursor = range.end;
  }
  result += html.slice(cursor);
  return result;
}

function assertHead(masked) {
  const open = HEAD_OPEN_RE.exec(masked);
  const close = HEAD_CLOSE_RE.exec(masked);
  if (!open) throw new Error("No <head> element found");
  if (!close || close.index < open.index) throw new Error("No matching </head> element found");
  return {
    start: open.index,
    openEnd: open.index + open[0].length,
    close: close.index,
  };
}

// Pure function: returns HTML with exactly one canonical CSP tag and one
// canonical referrer tag, inserted at the start of the real <head>.
export function injectSecurityMeta(html) {
  const cleaned = stripSecurityMetas(html);
  const masked = maskHtml(cleaned);
  const head = assertHead(masked);
  const charset = CHARSET_RE.exec(masked);

  const insertAt =
    charset && charset.index > head.start && charset.index + charset[0].length <= head.close
      ? charset.index + charset[0].length
      : head.openEnd;

  return cleaned.slice(0, insertAt) + CSP_TAG + REFERRER_TAG + cleaned.slice(insertAt);
}

// Pure function: returns a list of human-readable problems. An empty array
// means the document passes. Tags inside comments or raw-text elements are
// not counted, so they cannot satisfy verification.
export function verifySecurityMeta(html) {
  const errors = [];
  const masked = maskHtml(html);

  let head;
  try {
    head = assertHead(masked);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return errors;
  }

  const cspMatches = allMatches(CSP_META_RE, masked);
  const referrerMatches = allMatches(REFERRER_META_RE, masked);

  if (cspMatches.length !== 1) errors.push(`CSP meta count is ${cspMatches.length} (expected 1)`);
  if (referrerMatches.length !== 1) {
    errors.push(`Referrer meta count is ${referrerMatches.length} (expected 1)`);
  }

  const cspExact = countOccurrences(masked, CSP_TAG);
  const referrerExact = countOccurrences(masked, REFERRER_TAG);
  if (cspExact !== 1) errors.push(`CSP meta content match count is ${cspExact} (expected 1)`);
  if (referrerExact !== 1) {
    errors.push(`Referrer meta content match count is ${referrerExact} (expected 1)`);
  }

  if (cspMatches.length === 1) {
    const position = cspMatches[0].start;
    if (position < head.start || position >= head.close) {
      errors.push("CSP meta is outside <head>");
    } else {
      const afterHead = masked.slice(head.start);
      const firstScript = afterHead.search(SCRIPT_RE);
      const firstLink = afterHead.search(LINK_RE);
      const firstStyle = afterHead.search(STYLE_RE);
      if (firstScript !== -1 && position > head.start + firstScript) {
        errors.push("CSP meta is after the first <script>");
      }
      if (firstLink !== -1 && position > head.start + firstLink) {
        errors.push("CSP meta is after the first <link>");
      }
      if (firstStyle !== -1 && position > head.start + firstStyle) {
        errors.push("CSP meta is after the first <style>");
      }
    }
  }

  if (referrerMatches.length === 1) {
    const position = referrerMatches[0].start;
    if (position < head.start || position >= head.close) {
      errors.push("Referrer meta is outside <head>");
    }
  }

  return errors;
}

export function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) results.push(full);
  }
  return results.sort();
}

function main() {
  const verifyOnly = process.argv.includes("--verify");

  if (!fs.existsSync(OUT_DIR)) {
    console.error(`ERROR: export directory not found: ${OUT_DIR}`);
    process.exit(1);
  }

  const files = findHtmlFiles(OUT_DIR);
  if (files.length === 0) {
    console.error(`ERROR: no HTML files found under ${OUT_DIR}`);
    process.exit(1);
  }

  let changed = 0;
  for (const file of files) {
    const rel = path.relative(OUT_DIR, file);
    const original = fs.readFileSync(file, "utf8");
    const html = verifyOnly ? original : injectSecurityMeta(original);

    if (!verifyOnly && html !== original) {
      fs.writeFileSync(file, html, "utf8");
      changed++;
    }

    const errors = verifySecurityMeta(html);
    if (errors.length > 0) {
      throw new Error(`${rel}: ${errors.join("; ")}`);
    }
  }

  const action = verifyOnly ? "Verified" : "Processed";
  console.log(`${action} ${files.length} HTML file(s); ${changed} modified.`);
  for (const file of files) console.log(`  ok  ${path.relative(OUT_DIR, file)}`);
}

const invokedDirectly =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  try {
    main();
  } catch (error) {
    console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
