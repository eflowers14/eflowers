import type { Painting } from '@/lib/art-data';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

interface ArtCardProps {
  painting: Painting;
}

export function ArtCard({ painting }: ArtCardProps) {
  return (
    <Link href={`/art/${painting.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <div className="aspect-[3/4] overflow-hidden">
          <Image
            src={painting.imageUrl}
            alt={painting.name}
            width={600}
            height={800}
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={painting.imageHint}
          />
        </div>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-headline leading-tight">{painting.name}</CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-muted-foreground">{painting.artist}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
