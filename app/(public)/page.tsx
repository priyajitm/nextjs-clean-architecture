import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 items-center justify-center h-screen">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Welcome to</span>
        </h1>
        <h1 className="text-4xl font-bold">
          <span className="text-primary">HealthKeep</span>
        </h1>
      </div>
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">Create an account</Link>
        </Button>
      </div>
    </main>
  );
}
