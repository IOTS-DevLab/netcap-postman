const NetcapExport = (() => {
  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function buildPostmanUrl(urlStr, queryString) {
    let u;
    try {
      u = new URL(urlStr);
    } catch {
      return { raw: urlStr };
    }
    const url = {
      raw: urlStr,
      protocol: u.protocol.replace(":", ""),
      host: u.hostname.split("."),
      path: u.pathname.split("/").filter(Boolean),
      query: (queryString || []).map((q) => ({ key: q.name, value: q.value })),
    };
    if (u.port) url.port = u.port;
    return url;
  }

  function buildPostmanBody(postData) {
    if (!postData) return undefined;
    const mime = (postData.mimeType || "").split(";")[0].trim();

    if (mime === "application/x-www-form-urlencoded") {
      const params =
        postData.params && postData.params.length
          ? postData.params.map((p) => ({ key: p.name, value: p.value }))
          : (postData.text || "")
              .split("&")
              .filter(Boolean)
              .map((pair) => {
                const [k, v] = pair.split("=");
                return {
                  key: decodeURIComponent(k || ""),
                  value: decodeURIComponent(v || ""),
                };
              });
      return { mode: "urlencoded", urlencoded: params };
    }

    if (mime === "multipart/form-data") {
      const params =
        postData.params && postData.params.length
          ? postData.params.map((p) => ({
              key: p.name,
              value: p.value || "",
              type: p.fileName ? "file" : "text",
            }))
          : [];
      return { mode: "formdata", formdata: params };
    }

    const language = mime === "application/json" ? "json" : mime.includes("xml") ? "xml" : "text";
    return {
      mode: "raw",
      raw: postData.text || "",
      options: { raw: { language } },
    };
  }

  function toPostman(requests, opts) {
    const items = requests.map((r) => {
      const headers = opts
        .redactHeaders(r.requestHeaders)
        .filter((h) => !h.name.startsWith(":"))
        .map((h) => ({ key: h.name, value: h.value }));

      const item = {
        name: `${r.method} ${r.path}`,
        request: {
          method: r.method,
          header: headers,
          url: buildPostmanUrl(r.url, r.queryString),
        },
        response: [],
      };
      const body = buildPostmanBody(r.postData);
      if (body) item.request.body = body;
      return item;
    });

    return {
      info: {
        name: `NetCap Export ${new Date().toISOString()}`,
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: items,
    };
  }

  function shellEscape(s) {
    return `'${String(s).replace(/'/g, `'\\''`)}'`;
  }

  function toCurl(requests, opts) {
    const blocks = requests.map((r) => {
      const parts = [`curl -X ${r.method} ${shellEscape(r.url)}`];
      const headers = opts.redactHeaders(r.requestHeaders).filter((h) => !h.name.startsWith(":"));
      for (const h of headers) {
        parts.push(`  -H ${shellEscape(`${h.name}: ${h.value}`)}`);
      }
      if (r.postData && r.postData.text) {
        parts.push(`  --data-raw ${shellEscape(r.postData.text)}`);
      }
      return parts.join(" \\\n");
    });
    return blocks.join("\n\n");
  }

  function toHar(requests) {
    const entries = requests.map(
      (r) =>
        new Promise((resolve) => {
          r.harEntry.getContent((content, encoding) => {
            const clean = JSON.parse(JSON.stringify(r.harEntry));
            if (clean.response && clean.response.content) {
              clean.response.content.text = content || "";
              if (encoding) clean.response.content.encoding = encoding;
            }
            resolve(clean);
          });
        })
    );
    return Promise.all(entries).then((entries) => ({
      log: {
        version: "1.2",
        creator: { name: "NetCap → Postman Exporter", version: "0.1.0" },
        entries,
      },
    }));
  }

  function exportRequests(requests, format, opts) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");

    if (format === "postman") {
      const collection = toPostman(requests, opts);
      download(`netcap-collection-${ts}.json`, JSON.stringify(collection, null, 2), "application/json");
    } else if (format === "curl") {
      const script = "#!/bin/sh\n\n" + toCurl(requests, opts) + "\n";
      download(`netcap-curl-${ts}.sh`, script, "text/x-sh");
    } else if (format === "har") {
      toHar(requests).then((har) => {
        download(`netcap-${ts}.har`, JSON.stringify(har, null, 2), "application/json");
      });
    }
  }

  return { exportRequests };
})();
