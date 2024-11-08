import ManageAssets from "@/components/Assets/ManageAssets";
import Posts from "@/components/Posts/Posts";
import { createClient } from "@/lib/supabase/server";
import { CreatePostDialog } from "@/components/Posts/CreatePostDialog";
import { UploadAssetDialog } from "@/components/Assets/UploadAssetDialog";

export default async function Home() {
  const supabase = createClient();

  // TODO: implement some kind of role for user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = Boolean(user);

  return (
    <section className="flex flex-col p-12 max-w-3xl mx-auto">
      {isAdmin && <ManageAssets />}
      <div className="flex flex-row items-center gap-4">
        <h2 className="text-3xl font-bold my-4">Our Latest Posts</h2>
        {isAdmin && (
          <>
            <CreatePostDialog />
            <UploadAssetDialog />
          </>
        )}
      </div>

      <Posts />
    </section>
  );
}
