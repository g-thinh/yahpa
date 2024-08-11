import AuthButton from "@/components/auth-button";
import { ThemeDropdown } from "@/components/theme-dropdown";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ThemeDropdown />
      <Link href="/about">Go to About</Link>
      <AuthButton />
    </main>
  );
}
