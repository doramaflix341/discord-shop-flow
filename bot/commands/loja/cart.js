
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const database = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cart')
        .setDescription('Mostra os produtos em seu carrinho'),
    
    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const carrinho = await database.getCart(userId);
            
            if (carrinho.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('🛒 Seu carrinho está vazio!')
                    .setDescription('Use `/catalogo` para ver os produtos disponíveis.')
                    .setColor(0x5865F2);
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('🛒 Seu Carrinho')
                .setDescription('Produtos em seu carrinho:')
                .setColor(0x5865F2)
                .setTimestamp();

            let total = 0;

            carrinho.forEach(item => {
                const subtotal = item.preco * item.quantidade;
                total += subtotal;
                
                embed.addFields({
                    name: item.nome,
                    value: `💰 **Preço:** $${item.preco.toFixed(2)}\n📦 **Quantidade:** ${item.quantidade}\n💵 **Subtotal:** $${subtotal.toFixed(2)}`,
                    inline: true
                });
            });

            embed.addFields({
                name: '💳 Total Geral',
                value: `$${total.toFixed(2)}`,
                inline: false
            });

            embed.setFooter({ text: 'Use /checkout para finalizar a compra' });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
            await interaction.reply({
                content: '❌ Erro ao carregar seu carrinho. Tente novamente.',
                ephemeral: true
            });
        }
    },
};
