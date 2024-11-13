import { SignInForm } from "@/components/Auth/SignInForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  if (data.session) return redirect("/");

  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center items-center gap-2 ">
      <section className="max-w-xl">
        <SignInForm />
      </section>
    </div>
  );
}
