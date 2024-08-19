import { createClient } from "@/lib/supabase/server";
import Post from "./Post";

export const revalidate = 0;

export default async function Posts() {
  const supabase = createClient();

  // TODO: implement some kind of role for user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("posts").select("*");
  // .order("created_at", { ascending: true });

  if (!!user) {
    query = query?.filter("is_published", "in", "(true,false)");
  } else {
    query = query?.eq("is_published", true);
  }

  const { data: posts, error } = await query;

  if (posts?.length === 0) {
    return <p>No posts founds</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {posts?.map((post) => (
        <Post key={post.id} post={post} canEdit={!!user} />
      ))}
    </ul>
  );
}
