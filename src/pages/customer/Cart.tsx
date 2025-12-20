import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getCart, getCartSummary, removeFromCart, updateCartItemQuantity } from '@/lib/cart';
import { toast } from '@/hooks/use-toast';

export default function CartPage() {
  const [version, setVersion] = useState(0);

  const cart = useMemo(() => {
    // `version` forces a recompute after mutations
    void version;
    return getCart();
  }, [version]);

  const summary = useMemo(() => {
    void version;
    return getCartSummary();
  }, [version]);

  const refresh = () => setVersion(v => v + 1);

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
    toast({ title: 'Removed', description: 'Item removed from cart.' });
    refresh();
  };

  const handleQty = (itemId: string, nextQty: number) => {
    try {
      updateCartItemQuantity(itemId, nextQty);
      refresh();
    } catch (e: any) {
      toast({
        title: 'Unable to update quantity',
        description: e?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
        <p className="text-muted-foreground mt-1">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
        <p className="text-muted-foreground mt-1">
          Review items before checkout.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-md object-cover bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.basePrice.toFixed(2)} each
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm tabular-nums">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQty(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="font-medium tabular-nums">
                        ${(item.product.basePrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="tabular-nums">{summary.itemCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">${summary.subtotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="tabular-nums">${summary.total.toFixed(2)}</span>
              </div>

              <Button className="w-full" disabled>
                Checkout (coming soon)
              </Button>
              <p className="text-xs text-muted-foreground">
                Checkout flow will be wired next.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


