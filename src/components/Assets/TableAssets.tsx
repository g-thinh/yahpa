"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetObject } from "./ManageAssets";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

type ListAssetsProps = {
  assets: AssetObject[];
};
export default function TableAssets({ assets }: ListAssetsProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const deleteOneAsset = async (fileName: string) => {
    const { error } = await supabase.storage
      .from("assets")
      .remove([`public/${fileName}`]);

    toast({
      variant: error ? "destructive" : "default",
      title: error ? `${error.message}` : `${fileName} has been removed!`,
      description: new Date().toUTCString(),
    });

    router.refresh();
  };

  return (
    <div className="flex w-full my-4 border-neutral-200 rounded-xl max-w-sm items-center justify-center">
      <Table>
        <TableCaption>A list of your recently uploaded assets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets?.map((asset) => {
            return (
              <TableRow key={asset.id}>
                <TableCell className="flex items-center justify-center">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      alt={asset.name}
                      src={asset.publicUrl}
                      width={180}
                      height={180}
                    />
                  </AspectRatio>
                </TableCell>
                <TableCell className="max-w-5">
                  {new Date(asset.created_at).toDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteOneAsset(asset.name)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
