import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignUpConfirmationPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  if (data.session) return redirect("/");

  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center h-full items-center gap-2 ">
      <section className="max-w-md">
        <h3 className="text-2xl">Sign Up Complete</h3>
        <p>Please check your emails for a confirmation link.</p>
      </section>
    </div>
  );
}
