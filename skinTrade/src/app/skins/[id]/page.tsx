import Image from "next/image";
import { notFound } from "next/navigation";
import { getSkinById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { purchaseSkin } from "@/lib/actions";
import { ShoppingCart } from "lucide-react";

type SkinDetailPageProps = {
  params: { id: string };
};

export default async function SkinDetailPage({ params }: SkinDetailPageProps) {
  const skin = getSkinById(params.id);

  if (!skin) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl my-10">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
          <Image
            src={skin.image.imageUrl}
            alt={skin.name}
            width={600}
            height={400}
            data-ai-hint={skin.image.imageHint}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit">{skin.game}</Badge>
          <h1 className="text-4xl font-headline font-bold">{skin.name}</h1>
          
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-primary">{formatPrice(skin.price)}</p>
            <Badge className="text-sm">{skin.rarity}</Badge>
          </div>
          
          <div className="text-muted-foreground leading-relaxed">
            <p>{skin.description}</p>
          </div>

          <form action={purchaseSkin}>
             <input type="hidden" name="skinId" value={skin.id} />
             <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Purchase Skin
             </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-2">
            This is a simulated purchase. No real money will be charged.
          </p>
        </div>
      </div>
    </div>
  );
}
