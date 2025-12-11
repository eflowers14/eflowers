import { getAuthenticatedUser, getPurchasesForUser, getSkinById, getAllSkins } from "@/lib/data";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import AISuggestions from "./ai-suggestions";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }

  const purchases = await getPurchasesForUser(user.id);
  const purchasedSkins = purchases.map(p => ({
    ...getSkinById(p.skinId)!,
    purchaseDate: p.purchaseDate,
  }));

  const allSkins = getAllSkins();
  const purchaseHistoryIds = purchases.map(p => p.skinId);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                    {purchasedSkins.length > 0 ? (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Skin</TableHead>
                                <TableHead>Game</TableHead>
                                <TableHead>Rarity</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {purchasedSkins.map((skin) => (
                                <TableRow key={skin.id}>
                                <TableCell className="font-medium">{skin.name}</TableCell>
                                <TableCell>{skin.game}</TableCell>
                                <TableCell><Badge variant="outline">{skin.rarity}</Badge></TableCell>
                                <TableCell>{new Date(skin.purchaseDate).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">{formatPrice(skin.price)}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">You haven&apos;t purchased any skins yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Recommended For You</CardTitle>
                </CardHeader>
                <CardContent>
                  <AISuggestions userId={user.id} purchaseHistory={purchaseHistoryIds} availableSkins={allSkins} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
