"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import ResizableImage from "./ResizableImage";
import Callout, { type CalloutVariant } from "./CalloutExtension";
import { uploadToCloudinary } from "@/lib/cloudinary";

const HIGHLIGHT_COLORS = ["#fde68a", "#bbf7d0", "#bfdbfe", "#fbcfe8"];
const TEXT_COLORS = ["#111827", "#dc2626", "#d97706", "#059669", "#2563eb", "#7c3aed"];

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-xs font-medium transition-colors ${
        active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-gray-200" />;
}

function Toolbar({ editor, fullscreen, onToggleFullscreen }: { editor: Editor; fullscreen: boolean; onToggleFullscreen: () => void }) {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  async function handleImageUpload(file: File | undefined) {
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert(`Image is too large (${Math.round(file.size / 1024)}KB). Max allowed size is 500KB.`);
      return;
    }
    try {
      const url = await uploadToCloudinary(file);
      editor.chain().focus().setImage({ src: url } as never).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  function handleImageButtonClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => handleImageUpload(input.files?.[0]);
    input.click();
  }

  function handleLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  function handleYoutube() {
    const url = window.prompt("YouTube video URL", "https://www.youtube.com/watch?v=");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
  }

  function insertCallout(variant: CalloutVariant) {
    (editor.chain().focus() as unknown as { setCallout: (v: CalloutVariant) => { run: () => void } })
      .setCallout(variant)
      .run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
        ↺
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
        ↻
      </ToolbarButton>
      <Divider />

      <select
        value={
          editor.isActive("heading", { level: 1 })
            ? "1"
            : editor.isActive("heading", { level: 2 })
            ? "2"
            : editor.isActive("heading", { level: 3 })
            ? "3"
            : editor.isActive("heading", { level: 4 })
            ? "4"
            : editor.isActive("heading", { level: 5 })
            ? "5"
            : editor.isActive("heading", { level: 6 })
            ? "6"
            : "p"
        }
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: Number(v) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
        }}
        className="h-8 rounded-md border-0 bg-transparent px-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
      >
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>
      <Divider />

      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton label="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        {"</>"}
      </ToolbarButton>
      <Divider />

      <div className="relative">
        <ToolbarButton label="Text color" onClick={() => setShowTextColor((s) => !s)}>
          A
        </ToolbarButton>
        {showTextColor && (
          <div className="absolute left-0 top-9 z-10 flex gap-1 rounded-lg border border-gray-100 bg-white p-2 shadow-lg">
            {TEXT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  editor.chain().focus().setColor(c).run();
                  setShowTextColor(false);
                }}
                className="h-6 w-6 rounded-full border border-gray-200"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <ToolbarButton label="Highlight color" onClick={() => setShowHighlight((s) => !s)}>
          ▧
        </ToolbarButton>
        {showHighlight && (
          <div className="absolute left-0 top-9 z-10 flex gap-1 rounded-lg border border-gray-100 bg-white p-2 shadow-lg">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color: c }).run();
                  setShowHighlight(false);
                }}
                className="h-6 w-6 rounded-full border border-gray-200"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>
      <Divider />

      <ToolbarButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        ⟸
      </ToolbarButton>
      <ToolbarButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        ⟺
      </ToolbarButton>
      <ToolbarButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        ⟹
      </ToolbarButton>
      <Divider />

      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        •≡
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1≡
      </ToolbarButton>
      <ToolbarButton label="Checklist" active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}>
        ☑
      </ToolbarButton>
      <ToolbarButton label="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        “”
      </ToolbarButton>
      <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        {"{}"}
      </ToolbarButton>
      <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        —
      </ToolbarButton>
      <Divider />

      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={handleLink}>
        🔗
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={handleImageButtonClick}>
        🖼
      </ToolbarButton>
      <ToolbarButton label="Embed YouTube video" onClick={handleYoutube}>
        ▶
      </ToolbarButton>
      <ToolbarButton
        label="Insert table"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        ⊞
      </ToolbarButton>
      <Divider />

      <ToolbarButton label="Info callout" onClick={() => insertCallout("info")}>
        ℹ
      </ToolbarButton>
      <ToolbarButton label="Warning callout" onClick={() => insertCallout("warning")}>
        ⚠
      </ToolbarButton>
      <ToolbarButton label="Success callout" onClick={() => insertCallout("success")}>
        ✓
      </ToolbarButton>
      <ToolbarButton label="Danger callout" onClick={() => insertCallout("danger")}>
        ✕
      </ToolbarButton>
      <Divider />

      <ToolbarButton label={fullscreen ? "Exit fullscreen" : "Fullscreen"} active={fullscreen} onClick={onToggleFullscreen}>
        {fullscreen ? "⤦" : "⤢"}
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      ResizableImage.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Youtube.configure({ nocookie: true }),
      Placeholder.configure({ placeholder: "Start writing your policy content..." }),
      CharacterCount,
      Callout,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rte-content prose prose-sm sm:prose-base max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[100] flex flex-col bg-white"
          : "flex flex-col overflow-hidden rounded-xl border border-gray-200"
      }
    >
      <Toolbar editor={editor} fullscreen={fullscreen} onToggleFullscreen={() => setFullscreen((f) => !f)} />
      <div className={`flex-1 overflow-y-auto px-4 py-4 sm:px-6 ${fullscreen ? "" : "max-h-[600px]"}`}>
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-1.5 text-[11px] text-gray-400">
        <span>{editor.storage.characterCount.words()} words</span>
        <span>{editor.storage.characterCount.characters()} characters</span>
      </div>
    </div>
  );
}
