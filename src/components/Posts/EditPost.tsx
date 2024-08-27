"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/database.types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type EditPostProps = {
  post: Tables<"posts">;
};

export default function EditPost({ post }: EditPostProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(
    post.coverImage
  );
  const [error, setError] = useState<string | null>(null);

  // Save the HTML to supabase
  const handleSave = async () => {
    const { error } = await supabase
      .from("posts")
      .update({
        content,
        updated_at: new Date().toDateString(),
        title,
      })
      .eq("id", post.id);
    if (error) {
      setErrorMessage(error.message);
    }

    router.refresh();
    setOpen(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null); // Clear preview if not an image
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setError(null);

    try {
      const fileName = `public/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("assets") // Replace with your Supabase bucket name
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Generate public URL for the uploaded file
      const {
        data: { publicUrl },
      } = await supabase.storage.from("assets").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      setError(`Upload failed: ${(error as Error).message}`);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (error) {
      setErrorMessage(error.message);
    }

    router.refresh();
    setOpen(false);
  };

  const handleOnOpenChange = () => {
    setOpen(!open);
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Give your post a title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea
            placeholder="Type your post here."
            id="content"
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" onChange={handleFileChange} />
          {error && <p className="text-red-500">{error}</p>}
          {filePreview && (
            <AspectRatio
              ratio={16 / 9}
              className="bg-muted border-2 rounded-md"
            >
              <Image
                src={filePreview as string}
                alt="File preview"
                fill
                className="rounded-md object-contain"
              />
            </AspectRatio>
          )}
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <DialogFooter>
          <Button size="sm" variant="default" onClick={() => handleSave()}>
            Save
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
