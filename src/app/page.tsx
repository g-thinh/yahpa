import AddAssets from "@/components/Assets/AddAssets";
import CreatePost from "@/components/Posts/CreatePost";
import ManageAssets from "@/components/Assets/ManageAssets";
import Posts from "@/components/Posts/Posts";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  // TODO: implement some kind of role for user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex flex-col p-12 max-w-3xl mx-auto">
      {!!user && <CreatePost />}

      {!!user && <ManageAssets />}
      <h2 className="text-3xl font-bold my-4">Our Latest Posts</h2>
      <Posts />
    </section>
  );
}
