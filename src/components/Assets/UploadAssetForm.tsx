"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AspectRatio } from "../ui/aspect-ratio";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

type FormValues = z.infer<typeof formSchema>;

type UploadAssetFormProps = {
  onAfterSubmit?: (values: FormValues) => void;
  onCancel?: () => void;
};

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size < 10000000, {
      message: "Your image must be less than 10mb.",
    })
    .optional(),
});

export function UploadAssetForm({
  onAfterSubmit,
  onCancel,
}: UploadAssetFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [filePreview, setFilePreview] = useState<
    string | undefined | null | ArrayBuffer
  >(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

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
    if (!values.file) return;
    const fileName = `public/${Date.now()}_${values.file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("assets") // Replace with your Supabase bucket name
      .upload(fileName, values.file);

    if (uploadError) {
      throw uploadError;
    }

    toast({
      title: "New file has been added!",
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
          name="file"
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

        <div className="flex gap-2">
          <Button type="submit" disabled={!form.formState.isDirty}>
            Upload
          </Button>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
