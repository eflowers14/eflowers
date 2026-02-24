import { paintings, type Painting } from '@/lib/art-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, GalleryHorizontal } from 'lucide-react';
import { DecorativeLine } from '@/components/decorative-line';

interface ArtPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return paintings.map((painting) => ({
    slug: painting.slug,
  }));
}

const getPaintingData = (slug: string) => {
  const painting = paintings.find((p) => p.slug === slug);
  if (!painting) {
    return null;
  }
  const currentIndex = paintings.findIndex((p) => p.slug === slug);
  const prevPainting = currentIndex > 0 ? paintings[currentIndex - 1] : null;
  const nextPainting = currentIndex < paintings.length - 1 ? paintings[currentIndex + 1] : null;

  return { painting, prevPainting, nextPainting };
};

export default function ArtPage({ params }: ArtPageProps) {
  const data = getPaintingData(params.slug);

  if (!data) {
    notFound();
  }

  const { painting, prevPainting, nextPainting } = data;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <article className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
        <div className="md:col-span-3">
          <div className="aspect-[3/4] bg-card rounded-lg overflow-hidden shadow-lg">
            <Image
              src={painting.imageUrl}
              alt={painting.name}
              width={600}
              height={800}
              className="w-full h-full object-cover"
              data-ai-hint={painting.imageHint}
              priority
            />
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col">
          <div className="flex-grow">
            <h1 className="text-4xl lg:text-5xl font-bold font-headline text-primary">{painting.name}</h1>
            <p className="mt-2 text-xl text-muted-foreground font-medium">{painting.artist}</p>
            <p className="mt-1 text-sm text-muted-foreground">({painting.year})</p>
            
            <DecorativeLine className="my-6 text-accent" />

            <p className="text-lg leading-relaxed">{painting.description}</p>
            
            <p className="mt-8 text-3xl font-headline text-accent font-bold">
              {formatter.format(painting.price)}
            </p>
          </div>

          <div className="mt-12 space-y-4">
             <div className="flex justify-between items-center gap-4">
              {prevPainting ? (
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/art/${prevPainting.slug}`} aria-label={`Go to previous painting: ${prevPainting.name}`}>
                    <ArrowLeft />
                    Previous
                  </Link>
                </Button>
              ) : <div className="flex-1" />}

              {nextPainting ? (
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/art/${nextPainting.slug}`} aria-label={`Go to next painting: ${nextPainting.name}`}>
                    Next
                    <ArrowRight />
                  </Link>
                </Button>
              ) : <div className="flex-1" />}
            </div>
             <Button asChild variant="secondary" className="w-full">
                <Link href="/">
                    <GalleryHorizontal className="mr-2"/>
                    Back to Gallery
                </Link>
             </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
