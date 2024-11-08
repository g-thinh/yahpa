import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/lib/supabase/database.types";
import { EditPostDialog } from "./EditPostDialog";

type PostProps = {
  post: Tables<"posts">;
  canEdit: boolean;
};

export default function Post({ post, canEdit }: PostProps) {
  return (
    <li
      key={post.id}
      className="flex flex-row gap-6 p-4 items-center border-2 border-neutral-200 dark:border-neutral-500 rounded-xl"
    >
      <div className="flex flex-col gap-2 items-center">
        <p>{new Date(post.created_at).toLocaleDateString()}</p>
        {canEdit && (
          <Badge variant={post.is_published ? "default" : "outline"}>
            {post.is_published ? "Published" : "Draft"}
          </Badge>
        )}
      </div>
      <div className="w-full">
        <div className="flex flex-row items-center justify-between gap-4 mb-4">
          <p className="text-2xl font-bold">{post?.title}</p>
          {canEdit && (
            <div className="flex">
              <EditPostDialog post={post} />
            </div>
          )}
        </div>
        {post.coverImage && (
          <div className="max-w-[340px]">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <Image
                src={post.coverImage}
                alt="File preview"
                fill
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        )}
        <p>{post?.content}</p>
      </div>
    </li>
  );
}
