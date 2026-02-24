import { DecorativeLine } from './decorative-line';

export function Footer() {
  return (
    <footer className="mt-16">
      <DecorativeLine className="text-primary/50" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()}  Flowers INC. All rights reserved.</p>
      </div>
    </footer>
  );
}
