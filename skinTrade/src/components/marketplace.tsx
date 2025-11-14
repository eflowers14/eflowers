'use client';

import { useState, useEffect } from 'react';
import type { Skin, SkinRarity } from '@/lib/types';
import SkinCard from './skin-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type MarketplaceProps = {
  skins: Skin[];
};

export default function Marketplace({ skins }: MarketplaceProps) {
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>(skins);
  const [gameFilter, setGameFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState<SkinRarity | 'all'>('all');
  const [games, setGames] = useState<string[]>([]);
  const [rarities, setRarities] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const [gamesRes, raritiesRes] = await Promise.all([
          fetch('/api/skins/games'),
          fetch('/api/skins/rarities'),
        ]);

        const gamesJson = await gamesRes.json();
        const raritiesJson = await raritiesRes.json();

        if (gamesJson?.ok) setGames(gamesJson.data || []);
        if (raritiesJson?.ok) setRarities(raritiesJson.data || []);
      } catch (err) {
        // swallow errors; keep empty lists
        console.error('Failed to fetch filters', err);
      }
    }
    fetchFilters();
  }, []);

  const handleFilterChange = (game: string, rarity: string) => {
    let newFilteredSkins = skins;
    if (game !== 'all') {
      newFilteredSkins = newFilteredSkins.filter((skin) => skin.game === game);
    }
    if (rarity !== 'all') {
      newFilteredSkins = newFilteredSkins.filter((skin) => skin.rarity === rarity);
    }
    setFilteredSkins(newFilteredSkins);
  };

  const onGameChange = (value: string) => {
    setGameFilter(value);
    handleFilterChange(value, rarityFilter);
  };

  const onRarityChange = (value: SkinRarity | 'all') => {
    setRarityFilter(value);
    handleFilterChange(gameFilter, value);
  };

  return (
    <section id="marketplace" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Explore the Marketplace</h2>
          <p className="text-muted-foreground mt-4">
            Find the perfect skin to elevate your gaming experience. Use the filters to narrow down your search.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card rounded-lg shadow-sm">
          <Select onValueChange={onGameChange} defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              {games.map((game) => (
                <SelectItem key={game} value={game}>
                  {game}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={onRarityChange} defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              {rarities.map((rarity) => (
                <SelectItem key={rarity} value={rarity}>
                  {rarity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredSkins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkins.map((skin) => (
              <SkinCard key={skin.id} skin={skin} />
            ))}
          </div>
        ) : (
            <div className="text-center py-16 bg-card rounded-lg">
                <p className="text-muted-foreground">No skins found matching your criteria.</p>
            </div>
        )}
      </div>
    </section>
  );
}
