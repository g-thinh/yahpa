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
    <section className="flex flex-col max-w-3xl p-12 mx-auto">
      {isAdmin && <ManageAssets />}
      <div className="flex flex-row items-center gap-4">
        <h2 className="my-4 text-3xl font-bold">Our Latest Posts</h2>
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
