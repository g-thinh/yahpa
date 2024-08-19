"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { NotebookPen } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

export default function CreatePost() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    let publicUrl;
    if (file) {
      publicUrl = await uploadFile();
    }
    const { error } = await supabase.from("posts").insert({
      content,
      title,
      coverImage: publicUrl,
    });

    if (error) {
      setError(error.message);
      return;
    }

    toast({
      title: "New post has been added!",
      description: new Date().toUTCString(),
    });
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

  const handleOnOpenChange = () => {
    setOpen(!open);
    setFilePreview(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex border-2 my-4 border-neutral-200 rounded-xl min-h-[10vh] items-center justify-center">
      {open ? (
        <section className="flex flex-col gap-4 p-4">
          <div className="">
            <h2 className="font-bold">Create a new Post</h2>
            <p>
              Start editing your new post. When you are done click Save to
              submit it.
            </p>
          </div>
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
          <div className="flex gap-4">
            <Button size="sm" variant="default" onClick={() => handleSave()}>
              Create
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </section>
      ) : (
        <Button onClick={() => handleOnOpenChange()}>
          <NotebookPen className="mr-2 h-4 w-4" /> Write a new Post
        </Button>
      )}
    </div>
  );
}
