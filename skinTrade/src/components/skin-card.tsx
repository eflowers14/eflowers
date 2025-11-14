import Image from "next/image";
import Link from "next/link";
import type { Skin } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatPrice } from "@/lib/utils";

type SkinCardProps = {
  skin: Skin;
};

export default function SkinCard({ skin }: SkinCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/skins/${skin.id}`} className="block aspect-video relative">
          <Image
            src={skin.image.imageUrl}
            alt={skin.name}
            fill
            data-ai-hint={skin.image.imageHint}
            className="object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        <CardTitle className="font-headline text-lg mb-1 leading-tight">
          <Link href={`/skins/${skin.id}`} className="hover:text-primary transition-colors">{skin.name}</Link>
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{skin.game}</span>
          <Badge variant="outline">{skin.rarity}</Badge>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="font-semibold text-primary text-lg">{formatPrice(skin.price)}</p>
        <Button asChild size="sm" variant="secondary">
          <Link href={`/skins/${skin.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
