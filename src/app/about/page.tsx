import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";

export default function About() {
  return (
    <div>
      <h1>This is the About Page</h1>
      <Link href="/">
        <Button>Go Back</Button>
      </Link>
    </div>
  );
}
