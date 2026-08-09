(() => {
  const state = {
    requests: [],
    paused: false,
    redact: true,
    filter: "",
    expandedId: null,
  };

  const REDACT_HEADERS = new Set(["authorization", "cookie", "set-cookie"]);

  const els = {
    body: document.getElementById("requestsBody"),
    count: document.getElementById("count"),
    empty: document.getElementById("empty"),
    search: document.getElementById("search"),
    redact: document.getElementById("redact"),
    btnToggle: document.getElementById("btnToggle"),
    btnClear: document.getElementById("btnClear"),
    btnExport: document.getElementById("btnExport"),
    exportMenu: document.getElementById("exportMenu"),
  };

  let nextId = 1;

  function domainAndPath(url) {
    try {
      const u = new URL(url);
      return { domain: u.host, path: u.pathname + u.search };
    } catch {
      return { domain: "", path: url };
    }
  }

  function fmtSize(bytes) {
    if (bytes == null || bytes < 0) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  }

  function fmtTime(ms) {
    if (ms == null || ms < 0) return "-";
    if (ms < 1000) return Math.round(ms) + " ms";
    return (ms / 1000).toFixed(2) + " s";
  }

  function shortType(mime) {
    if (!mime) return "-";
    return mime.split(";")[0].split("/").pop();
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  }

  function onRequestFinished(harEntry) {
    if (state.paused) return;
    const req = harEntry.request;
    const res = harEntry.response;
    const { domain, path } = domainAndPath(req.url);
    const record = {
      id: nextId++,
      method: req.method,
      url: req.url,
      domain,
      path,
      status: res.status,
      statusText: res.statusText,
      type: (res.content && res.content.mimeType) || "",
      size: res.bodySize >= 0 ? res.bodySize : (res.content && res.content.size),
      time: harEntry.time,
      startedDateTime: harEntry.startedDateTime,
      requestHeaders: req.headers || [],
      responseHeaders: res.headers || [],
      queryString: req.queryString || [],
      postData: req.postData || null,
      harEntry,
    };
    state.requests.push(record);
    render();
  }

  chrome.devtools.network.onRequestFinished.addListener(onRequestFinished);

  function redactHeaders(headers) {
    if (!state.redact) return headers;
    return headers.map((h) =>
      REDACT_HEADERS.has(h.name.toLowerCase())
        ? { name: h.name, value: "***REDACTED***" }
        : h
    );
  }

  function matchesFilter(r) {
    if (!state.filter) return true;
    const f = state.filter.toLowerCase();
    return (
      r.url.toLowerCase().includes(f) ||
      r.method.toLowerCase().includes(f) ||
      String(r.status).includes(f)
    );
  }

  function render() {
    const filtered = state.requests.filter(matchesFilter);
    els.count.textContent = `${filtered.length} request${filtered.length === 1 ? "" : "s"}`;
    els.empty.classList.toggle("visible", state.requests.length === 0);

    els.body.innerHTML = "";
    for (const r of filtered) {
      const tr = document.createElement("tr");
      tr.dataset.id = r.id;
      tr.innerHTML = `
        <td class="method method-${escapeHtml(r.method)}">${escapeHtml(r.method)}</td>
        <td class="${r.status >= 400 || r.status === 0 ? "status-err" : "status-ok"}">${r.status || "-"}</td>
        <td>${escapeHtml(r.domain)}</td>
        <td title="${escapeHtml(r.path)}">${escapeHtml(r.path)}</td>
        <td>${escapeHtml(shortType(r.type))}</td>
        <td>${fmtSize(r.size)}</td>
        <td>${fmtTime(r.time)}</td>
      `;
      tr.addEventListener("click", () => toggleDetail(r.id));
      els.body.appendChild(tr);

      if (state.expandedId === r.id) {
        els.body.appendChild(buildDetailRow(r));
      }
    }
  }

  function toggleDetail(id) {
    state.expandedId = state.expandedId === id ? null : id;
    render();
  }

  function buildDetailRow(r) {
    const tr = document.createElement("tr");
    tr.className = "detail-row";
    const td = document.createElement("td");
    td.colSpan = 7;

    const reqHeaders = redactHeaders(r.requestHeaders);
    const resHeaders = redactHeaders(r.responseHeaders);
    const reqBody = r.postData ? r.postData.text || "" : "";
    const resBodyId = `resBody-${r.id}`;

    td.innerHTML = `
      <div class="detail-grid">
        <div class="detail-block">
          <h4>Request Headers</h4>
          <pre>${escapeHtml(reqHeaders.map((h) => `${h.name}: ${h.value}`).join("\n") || "(none)")}</pre>
        </div>
        <div class="detail-block">
          <h4>Response Headers</h4>
          <pre>${escapeHtml(resHeaders.map((h) => `${h.name}: ${h.value}`).join("\n") || "(none)")}</pre>
        </div>
        <div class="detail-block">
          <h4>Request Body</h4>
          <pre>${escapeHtml(reqBody || "(none)")}</pre>
        </div>
        <div class="detail-block">
          <h4>Response Body</h4>
          <pre id="${resBodyId}">Loading…</pre>
        </div>
      </div>
    `;
    tr.appendChild(td);

    r.harEntry.getContent((content) => {
      const el = document.getElementById(resBodyId);
      if (el) el.textContent = content || "(empty)";
    });

    return tr;
  }

  els.btnToggle.addEventListener("click", () => {
    state.paused = !state.paused;
    els.btnToggle.textContent = state.paused ? "▶ Resume" : "⏸ Pause";
    els.btnToggle.title = state.paused ? "Resume capture" : "Pause capture";
  });

  els.btnClear.addEventListener("click", () => {
    state.requests = [];
    state.expandedId = null;
    render();
  });

  els.search.addEventListener("input", (e) => {
    state.filter = e.target.value;
    render();
  });

  els.redact.addEventListener("change", (e) => {
    state.redact = e.target.checked;
    render();
  });

  els.btnExport.addEventListener("click", (e) => {
    e.stopPropagation();
    els.exportMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", () => els.exportMenu.classList.add("hidden"));

  els.exportMenu.addEventListener("click", (e) => {
    const format = e.target.dataset.format;
    if (!format) return;
    e.stopPropagation();
    els.exportMenu.classList.add("hidden");
    const filtered = state.requests.filter(matchesFilter);
    if (filtered.length === 0) return;
    NetcapExport.exportRequests(filtered, format, { redactHeaders });
  });

  render();
})();
