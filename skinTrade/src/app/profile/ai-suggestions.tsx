import { suggestSkinsBasedOnHistory, SuggestSkinsBasedOnHistoryOutput } from "@/ai/flows/suggest-skins-based-on-history";
import SkinCard from "@/components/skin-card";
import { getSkinById } from "@/lib/data";
import type { Skin } from "@/lib/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type AISuggestionsProps = {
  userId: string;
  purchaseHistory: string[];
  availableSkins: Skin[];
};

export default async function AISuggestions({ userId, purchaseHistory, availableSkins }: AISuggestionsProps) {
    
  let suggestions: SuggestSkinsBasedOnHistoryOutput['suggestions'] = [];
  try {
    const result = await suggestSkinsBasedOnHistory({
      userId,
      purchaseHistory,
      availableSkins: availableSkins.map(s => ({...s, imageURL: s.image.imageUrl})),
    });
    suggestions = result.suggestions;
  } catch (error) {
    console.error("AI suggestion error:", error);
    return <p className="text-destructive">Could not load suggestions at this time.</p>;
  }

  if (suggestions.length === 0) {
    return <p className="text-muted-foreground">No suggestions available yet. Purchase some skins to get recommendations!</p>;
  }
  
  const suggestedSkins = suggestions.map(s => getSkinById(s.id)).filter(Boolean) as Skin[];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {suggestedSkins.map((skin, index) => (
          <CarouselItem key={skin.id}>
            <div className="p-1">
                <SkinCard skin={skin} />
                <p className="text-xs text-muted-foreground mt-2 italic">
                    <strong>Reason:</strong> {suggestions[index].reason}
                </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12"/>
      <CarouselNext className="mr-12"/>
    </Carousel>
  );
}
