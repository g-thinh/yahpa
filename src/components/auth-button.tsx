import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild>
        <Link href="/my-account">Account</Link>
      </Button>

      <form action={signOut}>
        <Button variant="outline">Sign Out</Button>
      </form>
    </div>
  ) : (
    <Button asChild>
      <Link href="/signin">Sign In</Link>
    </Button>
  );
}
