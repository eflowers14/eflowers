import Link from "next/link";
import { Gem } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Gem className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold tracking-tight">
        SkinTrade
      </span>
    </Link>
  );
}
