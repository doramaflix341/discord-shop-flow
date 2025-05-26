
import { useState, useEffect } from 'react';
import { Product } from '@/types';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Discord Nitro 1 Mês',
    description: 'Tenha acesso a todos os recursos premium do Discord por 1 mês',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
    price: 9.99,
    stock: 50
  },
  {
    id: '2',
    name: 'Curso de Programação',
    description: 'Aprenda a programar do zero com nosso curso completo',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    price: 49.99,
    stock: 25
  },
  {
    id: '3',
    name: 'Pack de Emojis Personalizados',
    description: 'Mais de 100 emojis exclusivos para seu servidor',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    price: 19.99,
    stock: 100
  },
  {
    id: '4',
    name: 'Template de Servidor Premium',
    description: 'Template completo com canais organizados e bots configurados',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    price: 29.99,
    stock: 15
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      )
    );
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return {
    products,
    updateStock,
    getProductById
  };
};
