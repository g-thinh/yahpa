"use client";

import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/supabase/database.types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { EditPostForm } from "./EditPostForm";

type EditPostProps = {
  post: Tables<"posts">;
};

export default function EditPostDialog({ post }: EditPostProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <EditPostForm
          post={post}
          onAfterSubmit={() => setOpen(false)}
          onAfterDelete={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
