import Link from 'next/link';
import { DecorativeLine } from './decorative-line';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
          <Link href="/" className="text-3xl font-bold font-headline text-primary tracking-wider">
            Galeria de Mayte Flores
          </Link>
        </div>
      </div>
      <DecorativeLine className="text-primary/50" />
    </header>
  );
}
