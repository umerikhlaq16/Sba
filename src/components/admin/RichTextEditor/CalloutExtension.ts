import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutVariant = "info" | "warning" | "success" | "danger";

export const calloutStyles: Record<CalloutVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  success: "border-green-200 bg-green-50 text-green-900",
  danger: "border-red-200 bg-red-50 text-red-900",
};

const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "info",
        parseHTML: (el) => el.getAttribute("data-variant") || "info",
        renderHTML: (attrs) => ({ "data-variant": attrs.variant }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const variant = (node.attrs.variant as CalloutVariant) || "info";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-callout": "true",
        class: `rte-callout rounded-xl border px-5 py-4 my-4 ${calloutStyles[variant]}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCallout:
        (variant: CalloutVariant) =>
        ({ chain }: { chain: () => import("@tiptap/core").ChainedCommands }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs: { variant },
              content: [{ type: "paragraph" }],
            })
            .run(),
    } as Partial<import("@tiptap/core").RawCommands>;
  },
});

export default Callout;
