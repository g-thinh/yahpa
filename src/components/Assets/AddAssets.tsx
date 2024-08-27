"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

export default function AddAssets() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<Array<string | ArrayBuffer | null>>(
    []
  );
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const publicUrls = await uploadFiles();

    if (publicUrls) {
      const { error } = await supabase.from("posts").insert({
        images: publicUrls,
      });

      if (error) {
        setError(error.message);
        return;
      }
      toast({
        title: `${publicUrls.length} assets have been uploaded!`,
        description: new Date().toUTCString(),
      });
      router.refresh();
      setOpen(false);
    } else {
      console.log("no files to upload?");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget?.files;
    setPreviews([]);
    setFiles(selectedFiles);

    if (selectedFiles) {
      for (var i = 0; i < selectedFiles?.length; i++) {
        const reader = new FileReader();

        reader.readAsDataURL(selectedFiles[i]);

        reader.onloadend = (e) => {
          setPreviews((prev) => [...prev, reader.result]);
        };
      }
    }
  };

  const uploadFiles = async () => {
    if (!files) return;

    setError(null);
    let publicUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
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

        publicUrls.push(publicUrl);
      }

      return publicUrls;
    } catch (error) {
      setError(`Upload failed: ${(error as Error).message}`);
    }
  };

  const cancel = () => {
    setPreviews([]);
    setFiles(null);
  };

  return (
    <div className="flex my-4 items-center justify-center">
      <section className="flex w-full flex-col gap-4 p-4">
        <div>
          <h2 className="font-bold">Manage Assets</h2>
          <p>Upload or remove assets that can be used in any post.</p>
        </div>
        {previews.length > 0 && (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Carousel className="w-full">
              <CarouselContent>
                {previews.map((preview, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <AspectRatio
                        ratio={16 / 9}
                        className="bg-muted border-2 rounded-md"
                      >
                        <Image
                          src={preview as string}
                          alt="File preview"
                          fill
                          className="rounded-md object-contain"
                        />
                      </AspectRatio>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input
            id="picture"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div className="flex gap-4">
          <Button size="sm" variant="default" onClick={() => handleSave()}>
            Upload
          </Button>
          <Button size="sm" variant="ghost" onClick={cancel}>
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
}
