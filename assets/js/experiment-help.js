(() => {
  "use strict";

  function normalized(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function guideRows(root) {
    return Array.from(root.querySelectorAll(".control-guide-row")).map(row => {
      const name = row.querySelector(".control-name strong")?.textContent || "";
      const fields = Array.from(row.querySelectorAll(":scope > div:not(.control-name) p"));
      return {
        name,
        key: normalized(name),
        changes: fields[0]?.textContent?.trim() || "",
        fixed: fields[1]?.textContent?.trim() || "",
        watch: fields[2]?.textContent?.trim() || ""
      };
    });
  }

  function controlText(node) {
    if (node.tagName === "BUTTON") return node.textContent || "";
    if (node.tagName === "SELECT") return node.closest("label")?.textContent || node.id || "";
    if (node.tagName === "INPUT") return node.closest("label")?.textContent || node.getAttribute("aria-label") || node.id || "";
    return node.textContent || "";
  }

  function bestGuide(text, guides) {
    const key = normalized(text);
    if (!key) return null;
    const tokens = key.split(" ").filter(token => token.length > 2 && !/^\d+$/.test(token));
    let best = null;
    let score = 0;
    for (const guide of guides) {
      let candidate = 0;
      if (guide.key.includes(key) || key.includes(guide.key)) candidate += 5;
      for (const token of tokens) if (guide.key.includes(token)) candidate += 1;
      if (candidate > score) {
        score = candidate;
        best = guide;
      }
    }
    return score > 0 ? best : null;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector(".experiment-shell-v3");
    const apparatus = document.querySelector("#apparatus");
    if (!root || !apparatus) return;
    const guides = guideRows(root);
    if (!guides.length) return;

    apparatus.querySelectorAll("button, input, select").forEach(control => {
      const guide = bestGuide(controlText(control), guides);
      if (!guide) return;
      const parts = [];
      if (guide.changes) parts.push(`Changes: ${guide.changes}`);
      if (guide.fixed) parts.push(`Stays fixed: ${guide.fixed}`);
      if (guide.watch) parts.push(`Watch: ${guide.watch}`);
      if (!parts.length) return;
      control.title = parts.join(" ");
      control.dataset.experimentHelp = guide.name;
    });
  });
})();
