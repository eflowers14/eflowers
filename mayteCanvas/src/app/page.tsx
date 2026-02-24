import { paintings } from '@/lib/art-data';
import { ArtCard } from '@/components/art-card';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Mayte Collection
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover the rich heritage and vibrant stories of a cuban woman inspired in Ecuador through her art.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paintings.map((painting) => (
          <ArtCard key={painting.id} painting={painting} />
        ))}
      </div>
    </div>
  );
}
