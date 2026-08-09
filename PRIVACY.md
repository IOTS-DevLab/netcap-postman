# Privacy Policy — NetCap → Postman Exporter

Published by Intellorbis Technology Services (https://www.intellorbis.com)

Last updated: 2026-08-09

## Summary

NetCap → Postman Exporter does not collect, transmit, or store any data
outside your own browser. There are no servers, no analytics, and no
third-party network calls made by this extension.

## What the extension accesses

While its DevTools panel is open, the extension reads network request and
response data (URLs, headers, status codes, and bodies) for the inspected
page, using Chrome's `devtools.network` API. This is the same data already
visible in Chrome DevTools' own Network tab.

## What happens to that data

- Captured requests are held only in the memory of the open DevTools panel.
- Nothing is sent to any external server, by the extension or its author.
- Data is cleared when you click "Clear," close DevTools, or close the tab.
- When you use the Export feature, a file (Postman collection, HAR, or curl
  script) is generated locally in your browser and downloaded to your
  computer. That file never passes through any server controlled by the
  extension or its author.

## Sensitive headers

Authorization and Cookie header values may be captured like any other
header. The panel redacts them from the on-screen table and from exports by
default (toggle: "Redact Authorization / Cookie headers"). You are
responsible for reviewing exported files before sharing them, especially if
redaction is turned off.

## Permissions

The extension requests no host permissions and no permissions beyond the
DevTools panel API. It cannot read or modify pages outside of the DevTools
panel you open, and it has no access to your browsing history, bookmarks,
or other browser data.

## Changes to this policy

Any future change to what data this extension accesses will be reflected
in an updated version of this document.

## Contact

Intellorbis Technology Services
Website: https://www.intellorbis.com
Email: intellorbistech@gmail.com
