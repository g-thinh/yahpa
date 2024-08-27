import { createClient } from "@/lib/supabase/server";
import type { FileObject } from "@supabase/storage-js";
import AddAssets from "./AddAssets";
import TableAssets from "./TableAssets";

export interface AssetObject extends FileObject {
  publicUrl: string;
}

export default async function ManageAssets() {
  const supabase = createClient();

  const { data, error } = await supabase.storage.from("assets").list("public", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  let assets: AssetObject[] = [];

  if (!data || error) return <p>Error</p>;

  if (data) {
    for (const file of data) {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("assets")
        .getPublicUrl(`public/${file.name}`);

      assets.push({ ...file, publicUrl });
    }
  }

  return (
    <div className="flex flex-col border-2 my-4 border-neutral-200 rounded-xl min-h-[10vh] items-center justify-center">
      <AddAssets />
      <TableAssets assets={assets} />
    </div>
  );
}
