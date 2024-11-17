import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function MyAccountPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  if (!data.session) return redirect("/signin");

  const { first_name, last_name } = data.session.user.user_metadata;
  const userName = `${first_name} ${last_name}`;
  const joinedSince = new Date(data.session.user.created_at).toDateString();

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col max-w-xl gap-4 mb-8">
        <h1 className="text-3xl">My YAHPA Account</h1>
        <h2 className="font-bold">Manage your profile and online registry.</h2>
      </div>
      <div className="flex flex-col w-full max-w-3xl gap-6 ">
        <div className="flex items-center justify-center gap-6 p-4">
          <Avatar className="w-[128px] h-[128px]">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${userName}`} />
            <AvatarFallback>{userName}</AvatarFallback>
          </Avatar>
          <div className="">
            <p className="text-xl">{userName}</p>
            <p>Joined since: {joinedSince} </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-md gap-6 p-4 mx-auto text-center border-2 rounded-md flex-2">
          <p>
            Are you ready to create your online profile in the YAHPA Registry?
          </p>
          <Button asChild>
            <Link href="/my-account/register">Register</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
