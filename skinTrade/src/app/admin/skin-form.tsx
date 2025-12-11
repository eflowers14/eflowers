"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Skin, SkinRarity } from "@/lib/types";
import { addSkin, updateSkin } from "@/lib/actions";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  game: z.string().min(1, "Please select a game."),
  rarity: z.string().min(1, "Please select a rarity."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

type SkinFormProps = {
  skin: Skin | null;
  games: string[];
  rarities: SkinRarity[];
  onFinished: () => void;
};

export function SkinForm({ skin, games, rarities, onFinished }: SkinFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: skin?.name ?? "",
      game: skin?.game ?? "",
      rarity: skin?.rarity ?? "",
      price: skin?.price ?? 0,
      description: skin?.description ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (skin) {
        await updateSkin(skin.id, values);
        toast({ title: "Skin Updated", description: "The skin has been successfully updated." });
      } else {
        await addSkin(values);
        toast({ title: "Skin Added", description: "The new skin has been successfully added." });
      }
      onFinished();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: (error as Error).message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skin Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Reaver Vandal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="game"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rarity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rarity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rarity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rarities.map((rarity) => (
                      <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (USD)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="19.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the skin." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
