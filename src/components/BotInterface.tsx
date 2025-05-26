
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import DiscordMessage from './DiscordMessage';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  isBot: boolean;
}

const BotInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { products, updateStock, getProductById } = useProducts();
  const { cartItems, addToCart, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = 'user123'; // Simulated user ID

  useEffect(() => {
    // Welcome message
    addBotMessage('🤖 Olá! Bem-vindo à nossa loja Discord! Use os comandos:<br/>• <code>!produtos</code> - Ver catálogo<br/>• <code>!add [ID]</code> - Adicionar ao carrinho<br/>• <code>!cart</code> - Ver carrinho<br/>• <code>!checkout</code> - Finalizar compra');
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (username: string, content: string, isBot: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      content,
      timestamp: new Date().toLocaleTimeString(),
      isBot
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (content: string) => {
    setTimeout(() => {
      addMessage('LojaBot', content, true);
    }, 500);
  };

  const handleCommand = (command: string) => {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case '!produtos':
      case '!catalog':
        handleProductsCommand();
        break;
      case '!add':
        if (args[1]) {
          handleAddCommand(args[1]);
        } else {
          addBotMessage('⚠️ Use: <code>!add [ID_produto]</code>');
        }
        break;
      case '!cart':
      case '!carrinho':
        handleCartCommand();
        break;
      case '!checkout':
        handleCheckoutCommand();
        break;
      case '!clear':
        handleClearCommand();
        break;
      default:
        addBotMessage('❌ Comando não reconhecido. Use <code>!produtos</code> para ver opções disponíveis.');
    }
  };

  const handleProductsCommand = () => {
    let content = '📦 <strong>CATÁLOGO DE PRODUTOS</strong><br/><br/>';
    products.forEach(product => {
      const stockStatus = product.stock > 0 ? `✅ ${product.stock} disponível` : '❌ Esgotado';
      content += `<strong>ID: ${product.id}</strong> - ${product.name}<br/>`;
      content += `💰 $${product.price.toFixed(2)} | ${stockStatus}<br/>`;
      content += `${product.description}<br/><br/>`;
    });
    content += 'Use <code>!add [ID]</code> para adicionar ao carrinho!';
    addBotMessage(content);
  };

  const handleAddCommand = (productId: string) => {
    const product = getProductById(productId);
    
    if (!product) {
      addBotMessage(`❌ Produto com ID "${productId}" não encontrado!`);
      return;
    }

    if (product.stock <= 0) {
      addBotMessage(`❌ Produto "${product.name}" está esgotado!`);
      return;
    }

    // Check if user already has this item in cart
    const existingItem = cartItems.find(item => item.product.id === productId);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentQuantity >= product.stock) {
      addBotMessage(`⚠️ Você já tem o máximo disponível deste produto no carrinho!`);
      return;
    }

    addToCart(product);
    updateStock(productId, product.stock - 1);
    
    const newTotal = getCartTotal() + product.price;
    addBotMessage(`✅ ${product.name} adicionado ao seu carrinho!<br/>💰 Total: $${newTotal.toFixed(2)}`);
    
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleCartCommand = () => {
    if (cartItems.length === 0) {
      addBotMessage('🛒 Seu carrinho está vazio!');
      return;
    }

    let content = '🛒 <strong>SEU CARRINHO</strong><br/><br/>';
    cartItems.forEach(item => {
      const subtotal = item.product.price * item.quantity;
      content += `• ${item.product.name} x${item.quantity}<br/>`;
      content += `  💰 $${item.product.price.toFixed(2)} cada = $${subtotal.toFixed(2)}<br/><br/>`;
    });
    
    const total = getCartTotal();
    content += `<strong>💳 TOTAL: $${total.toFixed(2)}</strong><br/><br/>`;
    content += 'Use <code>!checkout</code> para finalizar a compra!';
    
    addBotMessage(content);
  };

  const handleCheckoutCommand = () => {
    if (cartItems.length === 0) {
      addBotMessage('⚠️ Seu carrinho está vazio! Adicione produtos antes de fazer checkout.');
      return;
    }

    const total = getCartTotal();
    const paymentUrl = `https://loveable.dev/checkout?total=${total}&user=${userId}`;
    
    addBotMessage(`💳 <strong>CHECKOUT</strong><br/><br/>Total: $${total.toFixed(2)}<br/><br/>🔗 <strong>Link de pagamento enviado no privado!</strong><br/><br/>⚠️ <em>(Em um bot real, seria enviado via DM)</em>`);
    
    // Simulate private message
    setTimeout(() => {
      addBotMessage(`<strong>💌 MENSAGEM PRIVADA</strong><br/><br/>Clique aqui para pagar: <a href="${paymentUrl}" target="_blank" style="color: #5865f2;">${paymentUrl}</a><br/><br/>⏰ Este link expira em 30 minutos.`);
    }, 1000);

    // Simulate payment confirmation after a few seconds
    setTimeout(() => {
      addBotMessage(`🎉 <strong>PAGAMENTO CONFIRMADO!</strong><br/><br/>Obrigado pela compra, @${userId}!<br/>📧 Você receberá os detalhes por email.`);
      clearCart();
      toast({
        title: "Pagamento confirmado! 🎉",
        description: "Sua compra foi processada com sucesso!",
      });
    }, 5000);
  };

  const handleClearCommand = () => {
    clearCart();
    addBotMessage('🗑️ Carrinho limpo com sucesso!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage('Você', input);
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-discord-primary rounded-lg overflow-hidden">
      <div className="bg-discord-secondary p-4 border-b border-discord-border">
        <h2 className="text-white font-semibold flex items-center gap-2">
          # loja-bot
          <span className="text-discord-muted text-sm">Bot de vendas ativo</span>
        </h2>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-2">
          {messages.map((message) => (
            <DiscordMessage
              key={message.id}
              username={message.username}
              content={message.content}
              timestamp={message.timestamp}
              isBot={message.isBot}
            />
          ))}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-discord-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite um comando (ex: !produtos)"
            className="flex-1 bg-discord-tertiary border-discord-border text-white placeholder:text-discord-muted"
          />
          <Button 
            type="submit" 
            className="bg-discord-blurple hover:bg-discord-blurple/80"
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BotInterface;
