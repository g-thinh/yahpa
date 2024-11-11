import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Registry() {
  return (
    <section className="flex flex-col  items-center">
      <h1 className="text-3xl mb-12">Registry</h1>
      <Button asChild>
        <Link href="/registry/signup">Signup for Registry</Link>
      </Button>
    </section>
  );
}
