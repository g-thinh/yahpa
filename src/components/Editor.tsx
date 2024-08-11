"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
  });

  if (!editor) return null;

  return (
    <div className="border-red-500 border-2">
      <ul>
        <li>
          <Button
            size="sm"
            variant={editor.isActive("bold") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </Button>
        </li>
      </ul>
      <EditorContent className="py-12" editor={editor} />
      <div className="flex gap-4">
        <Button size="sm" variant="ghost">
          Save
        </Button>
        <Button size="sm" variant="destructive">
          Cancel
        </Button>
      </div>
    </div>
  );
}
