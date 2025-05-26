
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/types';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartDisplayProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  total: number;
}

const CartDisplay = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  total 
}: CartDisplayProps) => {
  if (cartItems.length === 0) {
    return (
      <Card className="bg-discord-secondary border-discord-border">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-white mb-2">Seu carrinho está vazio!</h3>
          <p className="text-discord-muted">Adicione alguns produtos para começar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-discord-secondary border-discord-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🛒 Seu Carrinho
          <Badge variant="secondary">{cartItems.length} items</Badge>
        </CardTitle>
        <CardDescription className="text-discord-muted">
          Revise seus itens antes de finalizar a compra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item) => (
          <div 
            key={item.product.id} 
            className="flex items-center gap-4 p-4 bg-discord-primary rounded-lg"
          >
            <img 
              src={item.product.imageUrl} 
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-white">{item.product.name}</h4>
              <p className="text-green-400 font-medium">${item.product.price.toFixed(2)} cada</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 p-0 border-discord-border hover:bg-discord-hover"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 p-0 border-discord-border hover:bg-discord-hover"
              >
                <Plus className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveItem(item.product.id)}
                className="w-8 h-8 p-0 ml-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        
        <div className="border-t border-discord-border pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-white">Total:</span>
            <span className="text-green-400">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          onClick={onCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
          size="lg"
        >
          💳 Finalizar Compra
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartDisplay;
