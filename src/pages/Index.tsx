
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BotInterface from '@/components/BotInterface';
import ProductCard from '@/components/ProductCard';
import CartDisplay from '@/components/CartDisplay';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { products, updateStock } = useProducts();
  const { 
    cartItems, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItemCount,
    clearCart 
  } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      toast({
        title: "Produto esgotado",
        description: "Este produto não está mais disponível.",
        variant: "destructive"
      });
      return;
    }

    addToCart(product);
    updateStock(product.id, product.stock - 1);
    
    toast({
      title: "Produto adicionado! ✅",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleCheckout = () => {
    const total = getCartTotal();
    const paymentUrl = `https://loveable.dev/checkout?total=${total}`;
    
    // Simulate payment
    window.open(paymentUrl, '_blank');
    
    toast({
      title: "Redirecionando para pagamento 💳",
      description: "Você será redirecionado para finalizar sua compra.",
    });

    // Simulate successful payment after 3 seconds
    setTimeout(() => {
      toast({
        title: "Pagamento confirmado! 🎉",
        description: "Sua compra foi processada com sucesso!",
      });
      clearCart();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-discord-tertiary">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            🤖 Discord Sales Bot
          </h1>
          <p className="text-discord-muted text-lg">
            Sistema completo de vendas para Discord com carrinho e checkout integrado
          </p>
        </div>

        <Tabs defaultValue="bot" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-discord-secondary">
            <TabsTrigger value="bot" className="data-[state=active]:bg-discord-blurple">
              🤖 Bot Interface
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-discord-blurple">
              📦 Produtos
            </TabsTrigger>
            <TabsTrigger value="cart" className="data-[state=active]:bg-discord-blurple">
              🛒 Carrinho {getCartItemCount() > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {getCartItemCount()}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bot" className="mt-6">
            <Card className="bg-discord-secondary border-discord-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🤖 Simulador do Bot Discord
                </CardTitle>
                <CardDescription className="text-discord-muted">
                  Teste os comandos do bot como se estivesse no Discord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BotInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <CartDisplay
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                total={getCartTotal()}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Card className="bg-discord-secondary border-discord-border max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white">🚀 Funcionalidades Implementadas</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">✅ Bot Commands</h4>
                  <ul className="text-discord-muted space-y-1">
                    <li>• !produtos - Catálogo</li>
                    <li>• !add [ID] - Adicionar</li>
                    <li>• !cart - Ver carrinho</li>
                    <li>• !checkout - Finalizar</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">✅ Sistema de Vendas</h4>
                  <ul className="text-discord-muted space-y-1">
                    <li>• Controle de estoque</li>
                    <li>• Carrinho persistente</li>
                    <li>• Checkout integrado</li>
                    <li>• Tratamento de erros</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
