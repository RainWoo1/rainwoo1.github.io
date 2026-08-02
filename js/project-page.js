function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw };
  }

  const meta = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;
  let currentList = null;

  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && currentList) {
      currentList.push(line.replace(/^\s*-\s+/, "").trim());
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;

    currentKey = kv[1];
    const value = kv[2].trim();

    if (value === "" || value === "|" || value === ">") {
      currentList = [];
      meta[currentKey] = currentList;
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      meta[currentKey] = value.slice(1, -1);
      currentList = null;
    } else {
      meta[currentKey] = value;
      currentList = null;
    }
  }

  if (typeof meta.tech === "string") {
    meta.tech = meta.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return { meta, body: match[2].trim() };
}

function projectPage() {
  return {
    ...siteTheme(),
    loading: true,
    error: null,
    title: "",
    blurb: "",
    image: "",
    tech: [],
    links: {},
    bodyHtml: "",

    async init() {
      try {
        const res = await fetch("./content.md", { cache: "no-cache" });
        if (!res.ok) throw new Error("Could not load project content.");
        const raw = await res.text();
        const { meta, body } = parseFrontmatter(raw);

        this.title = meta.title || "Project";
        this.blurb = meta.blurb || "";
        this.image = meta.image || "";
        this.tech = Array.isArray(meta.tech) ? meta.tech : [];
        this.links = {
          live: meta.live || "",
          code: meta.code || "",
        };
        this.bodyHtml = marked.parse(body || "");
        document.title = `${this.title} — Jimin Woo`;
      } catch (err) {
        this.error = err.message || "Failed to load project.";
      } finally {
        this.loading = false;
      }
    },
  };
}
