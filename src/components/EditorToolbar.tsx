import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BubbleMenu, Editor } from "@tiptap/react";
import { Bold, Italic, Underline } from "lucide-react";

export default function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <ToggleGroup
        type="multiple"
        className="flex justify-start bg-white p-1 rounded-sm"
      >
        <ToggleGroupItem
          value="bold"
          size="sm"
          aria-label="Toggle bold"
          data-state={editor.isActive("bold") ? "on" : "off"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          size="sm"
          aria-label="Toggle italic"
          data-state={editor.isActive("italic") ? "on" : "off"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          size="sm"
          aria-label="Toggle underline"
          data-state={editor.isActive("underline") ? "on" : "off"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </BubbleMenu>
  );
}
