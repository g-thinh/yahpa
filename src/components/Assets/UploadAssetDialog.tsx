"use client";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ImageUp } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { UploadAssetForm } from "./UploadAssetForm";

export function UploadAssetDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <ImageUp className="mr-2 h-4 w-4" /> Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Upload Image or File</DialogTitle>
          <DialogDescription>
            Upload an image or a file to be stored in the cloud.
          </DialogDescription>
        </DialogHeader>
        <UploadAssetForm
          onAfterSubmit={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
