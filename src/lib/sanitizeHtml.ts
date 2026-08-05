import DOMPurify from "dompurify";

let configured = false;

function ensureConfigured() {
  if (configured || typeof window === "undefined") return;
  configured = true;

  // Allow YouTube embeds produced by the rich text editor.
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "iframe") {
      const src = (node as HTMLIFrameElement).getAttribute("src") || "";
      const allowed = /^https:\/\/(www\.)?youtube(-nocookie)?\.com\//.test(src);
      if (!allowed) node.parentNode?.removeChild(node);
    }
  });
}

/**
 * Sanitizes rich text HTML (from the admin editor) before it is rendered
 * with dangerouslySetInnerHTML on public pages. Blocks script injection
 * while preserving the editor's callouts, embeds, and image captions.
 */
export function sanitizePolicyHtml(html: string): string {
  // This is only ever called client-side (the policy page fetches and
  // renders content after mount), so a browser `window` is always present.
  if (typeof window === "undefined") return "";
  ensureConfigured();
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "target",
      "rel",
      "data-callout",
      "data-variant",
      "data-caption",
      "data-type",
      "data-checked",
      "style",
    ],
  });
}
