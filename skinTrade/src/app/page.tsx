import { Gem, Shield, Swords } from 'lucide-react';
import Image from 'next/image';

import { getAllSkins } from '@/lib/db';
import Marketplace from '@/components/marketplace';
import { Button } from '@/components/ui/button';

export default async function Home() {
  try {
    const allSkins = await getAllSkins();
    return (
      <div>
        <section className="relative bg-card text-card-foreground py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 z-10 relative">
            <div className="max-w-3xl text-center mx-auto">
              <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
                Your Ultimate Skin Marketplace
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Discover, trade, and showcase the rarest skins from your favorite games.
                Join a community of collectors and gamers.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Explore Marketplace
              </Button>
            </div>
          </div>
          <div className="w-full h-auto inset-0 z-0 opacity-10 dark:opacity-5">
             <Image 
               src="https://picsum.photos/seed/hero/1920/1080"
               alt="Gaming background"
               width={1920}
               height={1080}
               data-ai-hint="gaming collage"
               className="object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why SkinTrade?</h2>
              <p className="text-muted-foreground mt-4">
                We provide a secure, feature-rich platform for all your skin trading needs.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-12 w-12 mx-auto mb-4">
                  <Swords className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Vast Selection</h3>
                <p className="text-muted-foreground">Browse thousands of skins from top games like Valorant, CS:GO, and League of Legends.</p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-12 w-12 mx-auto mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Secure Transactions</h3>
                <p className="text-muted-foreground">Our platform ensures every purchase and trade is safe and protected.</p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-12 w-12 mx-auto mb-4">
                  <Gem className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Find Rare Items</h3>
                <p className="text-muted-foreground">Get your hands on exclusive and legendary skins that are hard to find anywhere else.</p>
              </div>
            </div>
          </div>
        </section>

        <Marketplace skins={allSkins} />
      </div>
    );
  } catch (error) {
    console.error('Error loading skins:', error);
    return <div className="container mx-auto py-8">Error loading marketplace</div>;
  }
}
