"use client";

import { useState } from 'react';
import { Button } from './ui/button';

type Props = {
  skinId: string;
};

export default function PurchaseButton({ skinId }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '1', skinId, purchaseDate: new Date().toISOString() }),
      });
      const payload = await res.json();
      if (payload.ok) setSuccess('Purchase recorded (simulated)');
      else setSuccess('Purchase failed');
    } catch {
      setSuccess('Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handlePurchase} disabled={loading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
        {loading ? 'Processing…' : 'Purchase Skin'}
      </Button>
      {success && <p className="text-xs text-center text-muted-foreground mt-2">{success}</p>}
    </div>
  );
}
