"use client";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FilePlus2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { CreatePostForm } from "./CreatePostForm";

export default function CreatePostDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FilePlus2 className="mr-2 h-4 w-4" /> Add Post
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Start creating your new post. When you are done click Save.
          </DialogDescription>
        </DialogHeader>
        <CreatePostForm onAfterSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
