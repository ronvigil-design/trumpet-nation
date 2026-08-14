/*
 * Exports the app as ONE self-contained HTML file for sharing.
 *
 * This is not a build step — index.html/app.js/styles.css remain the source of
 * truth and still run directly from disk with no tooling. This script only
 * flattens them for hosts that serve a single file and block external requests.
 *
 *   node scripts/export-standalone.mjs
 *
 * Two things are neutralized for that environment:
 *   - Service worker registration, since sw.js is not alongside the file.
 *   - history.pushState/replaceState, which throw in a sandboxed iframe.
 * Everything else, including localStorage persistence, is unchanged. (The
 * storage helper already degrades quietly when localStorage is unavailable.)
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFile(resolve(root, name), "utf8");

const [html, css, js] = await Promise.all([read("index.html"), read("styles.css"), read("app.js")]);

// Body markup, minus the external script tag we are about to inline.
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) throw new Error("Could not find <body> in index.html");
const body = bodyMatch[1].replace(/\s*<script src="app\.js" defer><\/script>/, "").trim();

// Fail loudly if the source moves, rather than silently shipping a page that
// tries to register a service worker that isn't there.
const swGuard = 'if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {';
if (!js.includes(swGuard)) throw new Error("Service worker guard not found — update export-standalone.mjs");

// The single-file build has no assets directory beside it, so any image the
// app references has to travel inside the file as a data URI.
const logo = await readFile(resolve(root, "assets/logo-384.png"));
const logoUri = `data:image/png;base64,${logo.toString("base64")}`;

const texture = await readFile(resolve(root, "assets/texture-scripture.png"));
const textureUri = `data:image/png;base64,${texture.toString("base64")}`;

const script = js
  .replace(swGuard, "if (false) {")
  .replaceAll("assets/logo-384.png", logoUri)
  // A literal </script> anywhere in a string would close the inline tag early.
  .replace(/<\/script/gi, "<\\/script");

const shim = `
// Sandboxed hosts can reject history writes; the app treats them as fire-and-forget.
(() => {
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method].bind(history);
    history[method] = (...args) => {
      try { original(...args); } catch (error) { /* sandboxed: ignore */ }
    };
  }
})();
`.trim();

// The copy is full of em dashes and curly quotes. Hosts that serve without a
// charset would mangle all of it, so declare it in the first bytes of content;
// the sniffer scans the document head regardless of a Content-Type header.
const styles = css.replaceAll("assets/texture-scripture.png", textureUri);

const out = `<meta charset="utf-8" />
<title>Trumpet</title>
<style>
${styles}
</style>
${body}
<script>
${shim}
${script}
</script>
`;

await mkdir(resolve(root, "dist"), { recursive: true });
const target = resolve(root, "dist/trumpet-standalone.html");
await writeFile(target, out, "utf8");

const kb = (Buffer.byteLength(out, "utf8") / 1024).toFixed(0);
console.log(`Wrote dist/trumpet-standalone.html (${kb} KB)`);
