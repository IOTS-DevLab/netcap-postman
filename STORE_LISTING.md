# Chrome Web Store listing — copy to paste into the Developer Dashboard

Publisher: Intellorbis Technology Services (https://www.intellorbis.com)

## Short description (max 132 chars, shown in search results)

Capture DevTools network traffic and export as a Postman collection, HAR, or curl — entirely offline, nothing leaves your browser.

(131 chars)

## Detailed description

NetCap → Postman Exporter adds a panel to Chrome DevTools that captures
every network request on the page you're inspecting, and lets you export
the whole session — or a filtered subset — in the format you need next:

• Postman Collection (v2.1) — drop straight into Postman, headers, query
  params, and request bodies included.
• HAR — for tools that expect the standard HTTP Archive format.
• curl commands — a plain shell script, one curl call per request.

Everything happens locally in your browser. Nothing is uploaded anywhere,
and the extension makes no network calls of its own — it only reads the
requests DevTools already sees.

Features:
• Pause/resume capture, clear, and live filter by URL, method, or status
• Click any request to inspect full headers and request/response bodies
• Optional one-click redaction of Authorization and Cookie headers before
  you export or share anything
• Zero permissions requested beyond the DevTools panel itself

Built for developers and QA engineers who need to turn a browser session
into a shareable Postman collection without manually re-typing requests.

## Category

Developer Tools

## Language

English

## Single purpose statement (if asked during review)

This extension's single purpose is to capture network requests visible in
Chrome DevTools and let the user export them as a Postman collection, HAR
file, or curl script.

## Permission justification (if asked — this extension requests none beyond devtools)

No permissions or host_permissions are requested. The extension only uses
the chrome.devtools.network API, which is scoped to the DevTools panel the
user explicitly opens.

## Privacy policy URL

Host PRIVACY.md somewhere public (e.g. GitHub Pages, a gist raw URL, or
your own site) and paste that URL into the "Privacy practices" tab. A
Markdown file on disk is not enough — Chrome Web Store requires a live URL.

## Assets still needed before submitting

- [ ] Store icon 128×128 PNG — icons/icon128.png already exists, confirm
      it looks correct at full size (no transparency issues).
- [ ] At least one screenshot, 1280×800 or 640×800, showing the panel with
      real captured requests (record this yourself — showing your own
      traffic is better than a synthetic demo).
- [ ] Optional: small promo tile 440×280, marquee 1400×560.
