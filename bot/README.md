
# Discord Sales Bot

Bot de vendas completo para Discord com sistema de carrinho, checkout e validação de pagamentos.

## 🚀 Funcionalidades

- `/catalogo` - Mostra produtos disponíveis
- `/add [id] [quantidade]` - Adiciona produto ao carrinho
- `/cart` - Visualiza carrinho do usuário
- `/checkout` - Gera link de pagamento
- `/validar` - Valida status do pagamento

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   ```env
   DISCORD_TOKEN=seu_token_do_bot
   CLIENT_ID=id_do_seu_bot
   URL_API_PAGAMENTO=https://api.pagamento.com
   ```

4. Registre os comandos slash:
   ```bash
   npm run deploy
   ```

5. Execute o bot:
   ```bash
   npm start
   ```

## 📦 Estrutura do Projeto

```
bot/
├── commands/
│   └── loja/
│       ├── catalogo.js
│       ├── add.js
│       ├── cart.js
│       ├── checkout.js
│       └── validar.js
├── events/
│   ├── ready.js
│   └── interactionCreate.js
├── utils/
│   └── database.js
├── index.js
├── deploy-commands.js
├── package.json
└── .env
```

## 💾 Banco de Dados

O bot usa SQLite com as seguintes tabelas:

- `produtos`: id, nome, descricao, imagem_url, preco, estoque
- `carrinho`: id, user_id, produto_id, quantidade

## 🔐 Segurança

- Todas as informações sensíveis são armazenadas em variáveis de ambiente
- Carrinho é isolado por usuário
- Verificação de estoque antes de adicionar produtos

## 🆘 Suporte

Para suporte, entre em contato através do servidor Discord ou abra uma issue no repositório.
