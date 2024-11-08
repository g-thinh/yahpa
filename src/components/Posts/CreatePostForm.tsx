"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof formSchema>;

type CreatePostFormProps = {
  onAfterSubmit?: (values: FormValues) => void;
};

const formSchema = z.object({
  title: z.string().min(0).max(50),
  content: z.string().min(0).max(250),
  is_published: z.boolean(),
  cover_file: z
    .instanceof(File)
    .refine((file) => file.size < 10000000, {
      message: "Your image must be less than 10mb.",
    })
    .optional(),
});

export function CreatePostForm({ onAfterSubmit }: CreatePostFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [filePreview, setFilePreview] = useState<
    string | undefined | null | ArrayBuffer
  >(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      is_published: false,
      cover_file: undefined,
    },
  });

  async function uploadCoverImage(file?: File) {
    if (!file) return;
    try {
      const fileName = `public/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
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
      console.error(`Upload failed: ${(error as Error).message}`);
    }
  }

  function handleFilePreview(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.currentTarget.files?.[0] || null;
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null); // Clear preview if not an image
    }
  }

  async function onSubmit(values: FormValues) {
    const publicUrl = await uploadCoverImage(values?.cover_file);

    await supabase.from("posts").insert({
      content: values.content,
      updated_at: new Date().toDateString(),
      title: values.title,
      is_published: values.is_published,
      coverImage: publicUrl,
    });
    toast({
      title: "New post has been added!",
      description: new Date().toUTCString(),
    });

    // handle any additional effects after submitting the form
    if (onAfterSubmit) {
      onAfterSubmit(values);
    }

    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="title"
                  placeholder="Give your post a title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your post here."
                  id="content"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Content of your post. Up to 250 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover_file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...fieldProps}
                  onChange={(e) => {
                    handleFilePreview(e);
                    onChange(e.target.files && e.target.files[0]);
                  }}
                />
              </FormControl>

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

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish</FormLabel>
                <FormDescription>
                  This will set the post to be public.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={!form.formState.isDirty}>
            Create Post
          </Button>
        </div>
      </form>
    </Form>
  );
}
