import { SignUpForm } from "@/components/Auth/SignUpForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  if (data.session) return redirect("/");

  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center items-center gap-2 ">
      <section className="max-w-xl">
        <SignUpForm />
      </section>
    </div>
  );
}
