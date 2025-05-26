
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));
        this.init();
    }

    init() {
        // Criar tabela de produtos
        this.db.run(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                descricao TEXT NOT NULL,
                imagem_url TEXT NOT NULL,
                preco REAL NOT NULL,
                estoque INTEGER NOT NULL DEFAULT 0
            )
        `);

        // Criar tabela de carrinho
        this.db.run(`
            CREATE TABLE IF NOT EXISTS carrinho (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                produto_id INTEGER NOT NULL,
                quantidade INTEGER NOT NULL DEFAULT 1,
                FOREIGN KEY (produto_id) REFERENCES produtos (id)
            )
        `);

        // Inserir produtos de exemplo (se não existirem)
        this.db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
            if (row.count === 0) {
                this.seedProducts();
            }
        });
    }

    seedProducts() {
        const produtos = [
            {
                nome: 'Discord Nitro 1 Mês',
                descricao: 'Tenha acesso a todos os recursos premium do Discord por 1 mês',
                imagem_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
                preco: 9.99,
                estoque: 50
            },
            {
                nome: 'Curso de Programação',
                descricao: 'Aprenda a programar do zero com nosso curso completo',
                imagem_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
                preco: 49.99,
                estoque: 25
            },
            {
                nome: 'Pack de Emojis Personalizados',
                descricao: 'Mais de 100 emojis exclusivos para seu servidor',
                imagem_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
                preco: 19.99,
                estoque: 100
            }
        ];

        produtos.forEach(produto => {
            this.db.run(
                "INSERT INTO produtos (nome, descricao, imagem_url, preco, estoque) VALUES (?, ?, ?, ?, ?)",
                [produto.nome, produto.descricao, produto.imagem_url, produto.preco, produto.estoque]
            );
        });
    }

    getAllProducts() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM produtos WHERE estoque > 0", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getProductById(id) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM produtos WHERE id = ?", [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    updateStock(productId, newStock) {
        return new Promise((resolve, reject) => {
            this.db.run("UPDATE produtos SET estoque = ? WHERE id = ?", [newStock, productId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    addToCart(userId, productId, quantidade = 1) {
        return new Promise((resolve, reject) => {
            // Verificar se já existe no carrinho
            this.db.get(
                "SELECT * FROM carrinho WHERE user_id = ? AND produto_id = ?",
                [userId, productId],
                (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (row) {
                        // Atualizar quantidade
                        this.db.run(
                            "UPDATE carrinho SET quantidade = quantidade + ? WHERE user_id = ? AND produto_id = ?",
                            [quantidade, userId, productId],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    } else {
                        // Inserir novo item
                        this.db.run(
                            "INSERT INTO carrinho (user_id, produto_id, quantidade) VALUES (?, ?, ?)",
                            [userId, productId, quantidade],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    }
                }
            );
        });
    }

    getCart(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT c.quantidade, p.* 
                FROM carrinho c 
                JOIN produtos p ON c.produto_id = p.id 
                WHERE c.user_id = ?
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    clearCart(userId) {
        return new Promise((resolve, reject) => {
            this.db.run("DELETE FROM carrinho WHERE user_id = ?", [userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new Database();
