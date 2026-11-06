import test from "node:test";
import assert from "node:assert/strict";

import {
  CSP_TAG,
  REFERRER_TAG,
  injectSecurityMeta,
  verifySecurityMeta,
} from "./inject-security-meta.mjs";

function count(haystack, needle) {
  let total = 0;
  let index = 0;
  while ((index = haystack.indexOf(needle, index)) !== -1) {
    total++;
    index += needle.length;
  }
  return total;
}

function assertValid(html) {
  assert.deepEqual(verifySecurityMeta(html), []);
}

test("normal minified Next.js HTML", () => {
  const html =
    '<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width"/><link rel="preload" href="/domingo/_next/static/chunks/a.js" as="script"/><script src="/domingo/_next/static/chunks/a.js"></script></head><body><div id="root">x</div></body></html>';

  const out = injectSecurityMeta(html);

  assert.ok(out.includes('<meta charSet="utf-8"/>' + CSP_TAG + REFERRER_TAG));
  assert.equal(count(out, CSP_TAG), 1);
  assert.equal(count(out, REFERRER_TAG), 1);
  assert.ok(out.indexOf(CSP_TAG) < out.indexOf("<link"));
  assert.ok(out.indexOf(CSP_TAG) < out.indexOf("<script"));
  assertValid(out);
});

test("pretty-printed HTML is byte-idempotent", () => {
  const html = [
    "<!DOCTYPE html>",
    "<html>",
    "  <head>",
    '    <meta charset="utf-8">',
    '    <meta name="viewport" content="width=device-width">',
    '    <link rel="stylesheet" href="/x.css">',
    "  </head>",
    "  <body>",
    "  </body>",
    "</html>",
  ].join("\n");

  const once = injectSecurityMeta(html);
  const twice = injectSecurityMeta(once);

  assert.equal(twice, once);
  assert.ok(once.includes('<meta charset="utf-8">' + CSP_TAG + REFERRER_TAG));
  assert.ok(once.includes('\n    <meta name="viewport"'));
  assertValid(once);
});

test("charset declaration inside an HTML comment", () => {
  const html =
    '<!DOCTYPE html><html><head><!-- <meta charset="utf-8"> --><meta charset="utf-8"><link rel="stylesheet" href="/x.css"></head><body></body></html>';

  const out = injectSecurityMeta(html);
  const commentEnd = out.indexOf("-->") + 3;
  const cspPosition = out.indexOf(CSP_TAG);

  assert.ok(cspPosition > commentEnd);
  assert.ok(out.includes('<meta charset="utf-8">' + CSP_TAG + REFERRER_TAG));
  assert.ok(!out.includes("<!--" + CSP_TAG));
  assertValid(out);

  const onlyCommented =
    '<!DOCTYPE html><html><head><!-- <meta charset="utf-8"> --><link rel="stylesheet" href="/x.css"></head><body></body></html>';
  const fallback = injectSecurityMeta(onlyCommented);

  assert.ok(fallback.includes("<head>" + CSP_TAG + REFERRER_TAG + "<!--"));
  assertValid(fallback);
});

test("CSP and referrer tags inside comments are ignored", () => {
  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><!-- <meta http-equiv="Content-Security-Policy" content="default-src *"><meta name="referrer" content="no-referrer"> --></head><body></body></html>';

  const out = injectSecurityMeta(html);

  assert.equal(count(out, CSP_TAG), 1);
  assert.equal(count(out, REFERRER_TAG), 1);
  assert.ok(out.includes('<!-- <meta http-equiv="Content-Security-Policy" content="default-src *">'));
  assertValid(out);

  const onlyCommented =
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><!-- " +
    CSP_TAG +
    REFERRER_TAG +
    " --></head><body></body></html>";
  const errors = verifySecurityMeta(onlyCommented);

  assert.ok(errors.some((error) => error.includes("CSP meta count is 0")));
  assert.ok(errors.some((error) => error.includes("Referrer meta count is 0")));
});

test("missing CSP is rejected", () => {
  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' + REFERRER_TAG + "</head><body></body></html>";

  const errors = verifySecurityMeta(html);

  assert.ok(errors.some((error) => error.includes("CSP meta count is 0")));
});

test("missing Referrer-Policy is rejected", () => {
  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' + CSP_TAG + "</head><body></body></html>";

  const errors = verifySecurityMeta(html);

  assert.ok(errors.some((error) => error.includes("Referrer meta count is 0")));
});

test("duplicate CSP is rejected and repaired by injection", () => {
  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    CSP_TAG +
    CSP_TAG +
    REFERRER_TAG +
    "</head><body></body></html>";

  const errors = verifySecurityMeta(html);

  assert.ok(errors.some((error) => error.includes("CSP meta count is 2")));

  const out = injectSecurityMeta(html);

  assert.equal(count(out, CSP_TAG), 1);
  assertValid(out);
});

test("duplicate Referrer-Policy is rejected and repaired by injection", () => {
  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    CSP_TAG +
    REFERRER_TAG +
    REFERRER_TAG +
    "</head><body></body></html>";

  const errors = verifySecurityMeta(html);

  assert.ok(errors.some((error) => error.includes("Referrer meta count is 2")));

  const out = injectSecurityMeta(html);

  assert.equal(count(out, REFERRER_TAG), 1);
  assertValid(out);
});

test("repeated injection is stable", () => {
  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body><p>hi</p></body></html>';

  const once = injectSecurityMeta(html);

  assert.equal(injectSecurityMeta(once), once);
  assertValid(once);
});

test("missing head element is rejected", () => {
  assert.throws(
    () => injectSecurityMeta('<!DOCTYPE html><html><body><meta charset="utf-8"></body></html>'),
    /No <head>/
  );

  const errors = verifySecurityMeta("<!DOCTYPE html><html><body></body></html>");

  assert.ok(errors.length > 0);
  assert.ok(errors.some((error) => error.includes("<head>")));
});

test("missing closing head element is rejected", () => {
  assert.throws(
    () => injectSecurityMeta('<html><head><meta charset="utf-8"></html>'),
    /<\/head>/
  );
});

test("meta-like text inside script contents is ignored", () => {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><script>var fake = '<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src *">';</script><link rel="stylesheet" href="/x.css"></head><body></body></html>`;

  const out = injectSecurityMeta(html);

  assert.ok(out.includes('<meta charset="utf-8">' + CSP_TAG + REFERRER_TAG));
  assertValid(out);

  const onlyScript = `<!DOCTYPE html><html><head><script>var fake = '<meta charset="utf-8">';</script><link rel="stylesheet" href="/x.css"></head><body></body></html>`;
  const fallback = injectSecurityMeta(onlyScript);

  assert.ok(fallback.includes("<head>" + CSP_TAG + REFERRER_TAG + "<script>"));
  assertValid(fallback);
});
