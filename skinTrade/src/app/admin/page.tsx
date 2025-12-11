"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SkinForm } from "./skin-form";
import { SkinsTable } from "./skins-table";
import { getAllSkins, getGames, getRarities } from "@/lib/data";
import type { Skin } from "@/lib/types";

export default function AdminPage() {
  // In a real app, this data would be fetched from an API
  const skins = getAllSkins();
  const games = getGames();
  const rarities = getRarities();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedSkin, setSelectedSkin] = React.useState<Skin | null>(null);

  const handleAdd = () => {
    setSelectedSkin(null);
    setDialogOpen(true);
  };

  const handleEdit = (skin: Skin) => {
    setSelectedSkin(skin);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSkin(null);
  };
  
  // In a real app, you would add authentication checks here
  // to ensure only admins can access this page.

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Skin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedSkin ? 'Edit Skin' : 'Add New Skin'}</DialogTitle>
              <DialogDescription>
                {selectedSkin ? 'Update the details of the skin.' : 'Fill in the details for the new skin.'}
              </DialogDescription>
            </DialogHeader>
            <SkinForm 
              skin={selectedSkin} 
              games={games} 
              rarities={rarities} 
              onFinished={handleDialogClose} 
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-6 rounded-md">
        <p className="font-bold">Developer Note</p>
        <p>This is a mock admin panel. Add, Edit, and Delete operations are simulated and will not persist.</p>
      </div>
      <SkinsTable skins={skins} onEdit={handleEdit} />
    </div>
  );
}
