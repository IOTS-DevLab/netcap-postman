# NetCap → Postman Exporter

A Chrome DevTools panel that captures network traffic and exports it as a
ready-to-use **Postman collection**, **HAR** file, or **curl** script —
entirely offline. Nothing captured ever leaves your browser.

Published by [Intellorbis Technology Services](https://www.intellorbis.com).

## Features

- Captures every request/response DevTools sees, while the panel is open
- Pause/resume capture, clear, and live filter by URL, method, or status
- Click a row to inspect full request/response headers and bodies
- One-click redaction of `Authorization` and `Cookie` headers before you
  export or share anything
- Export as:
  - **Postman Collection** (v2.1 JSON) — import straight into Postman
  - **HAR** — standard HTTP Archive format
  - **curl commands** — a plain shell script, one `curl` per request
- Requests no permissions beyond the DevTools panel itself

## Install

### From the Chrome Web Store

Not yet published. Until then, install from source (below).

### From source (unpacked)

1. Clone this repo:
   ```
   git clone https://github.com/IOTS-DevLab/netcap-postman.git
   ```
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (toggle, top right).
4. Click **Load unpacked** and select the cloned `netcap-postman` folder.
5. Confirm the "NetCap → Postman Exporter" card shows up with its toggle
   on and no red "Errors" button.

This extension has no toolbar icon or popup — it only adds a panel inside
DevTools, so there's nothing to click in the toolbar after installing.

## Usage

1. Open any regular webpage (not a `chrome://` page — DevTools extensions
   can't run there).
2. Open DevTools (`Cmd+Option+I` on Mac, `F12` / `Ctrl+Shift+I` on
   Windows/Linux).
3. Find the **NetCap Export** tab in the DevTools tab row (Elements,
   Console, Network, ...). If the window is narrow, it may be hidden
   behind the `»` overflow chevron at the end of the tab row.
4. Reload the page to start capturing requests.
5. Use the toolbar to:
   - **⏸ Pause / ▶ Resume** — stop or resume capturing new requests
   - **🗑 Clear** — discard everything captured so far
   - **Filter box** — narrow the table by URL, method, or status code
   - **Redact Authorization / Cookie headers** — on by default; strips
     those header values from the table, detail view, and exports
6. Click any row to expand it and inspect request/response headers and
   bodies.
7. Click **⬇ Export** and choose a format:
   - **Postman Collection (.json)** — import into Postman via
     *File → Import*
   - **HAR (.har)** — for tools that expect the standard HAR format
   - **curl commands (.sh)** — a shell script with one `curl` call per
     captured request

Exports only include the requests currently matching your filter, so you
can narrow down to the calls you care about before exporting.

## Privacy

See [PRIVACY.md](PRIVACY.md). Short version: no data collection, no
network calls made by the extension, everything stays local until you
choose to export a file to disk.

## License

All rights reserved — see [LICENSE](LICENSE).
