import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

const WIDTHS = ["25%", "50%", "75%", "100%"];

function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, caption, width } = node.attrs;

  return (
    <NodeViewWrapper as="figure" className="rte-figure my-4" style={{ width: width || "100%" }}>
      <div className={`relative overflow-hidden rounded-lg ${selected ? "ring-2 ring-gray-900" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || ""} className="w-full" />
        <div className="absolute left-2 top-2 flex gap-1 rounded-lg bg-white/90 p-1 opacity-0 shadow-sm transition-opacity hover:opacity-100 focus-within:opacity-100">
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => updateAttributes({ width: w })}
              className={`rounded px-2 py-1 text-[10px] font-medium ${
                width === w ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={caption || ""}
        onChange={(e) => updateAttributes({ caption: e.target.value })}
        placeholder="Add a caption (optional)"
        className="mt-2 w-full border-none bg-transparent text-center text-xs text-gray-400 outline-none placeholder:text-gray-300"
      />
    </NodeViewWrapper>
  );
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (el) => el.style.width || el.getAttribute("width") || "100%",
        renderHTML: (attrs) => ({ style: `width: ${attrs.width}` }),
      },
      caption: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-caption") || "",
        renderHTML: (attrs) => ({ "data-caption": attrs.caption }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

export default ResizableImage;
