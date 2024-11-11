import Link from "next/link";
import AuthButton from "./auth-button";
import { ThemeDropdown } from "./theme-dropdown";

export function Header() {
  return (
    <header className="flex justify-between items-center mx-6 my-4">
      <span className="font-semibold text-xl">YAHPA</span>
      <nav>
        <ul className="flex flex-row items-center gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/registry">Registry</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <AuthButton />
          </li>
          <li>
            <ThemeDropdown />
          </li>
        </ul>
      </nav>
    </header>
  );
}
