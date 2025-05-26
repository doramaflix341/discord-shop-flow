
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const database = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catalogo')
        .setDescription('Mostra o catálogo de produtos disponíveis'),
    
    async execute(interaction) {
        try {
            const produtos = await database.getAllProducts();
            
            if (produtos.length === 0) {
                await interaction.reply({
                    content: '🛒 Nenhum produto disponível no momento.',
                    ephemeral: true
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('🛍️ Catálogo de Produtos')
                .setDescription('Confira nossos produtos disponíveis!')
                .setColor(0x5865F2)
                .setTimestamp();

            produtos.forEach(produto => {
                embed.addFields({
                    name: `${produto.nome} - ID: ${produto.id}`,
                    value: `${produto.descricao}\n💰 **Preço:** $${produto.preco.toFixed(2)}\n📦 **Estoque:** ${produto.estoque} unidades`,
                    inline: true
                });
            });

            embed.setFooter({ text: 'Use /add [id] para adicionar ao carrinho' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            await interaction.reply({
                content: '❌ Erro ao carregar o catálogo. Tente novamente.',
                ephemeral: true
            });
        }
    },
};
