
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  disabled?: boolean;
}

const ProductCard = ({ product, onAddToCart, disabled }: ProductCardProps) => {
  return (
    <Card className="bg-discord-secondary border-discord-border hover:border-discord-accent transition-colors">
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-40 object-cover rounded-lg"
          />
          <Badge 
            variant={product.stock > 0 ? "default" : "destructive"} 
            className="absolute top-2 right-2"
          >
            {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardTitle className="text-white text-lg mb-2">{product.name}</CardTitle>
        <CardDescription className="text-discord-muted mb-3">
          {product.description}
        </CardDescription>
        <div className="text-2xl font-bold text-green-400">
          ${product.price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(product)}
          disabled={disabled || product.stock === 0}
          className="w-full bg-discord-blurple hover:bg-discord-blurple/80 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
