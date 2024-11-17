import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  if (!data.session) return redirect("/signup");

  return children;
}
