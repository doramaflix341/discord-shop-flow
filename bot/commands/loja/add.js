
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const database = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Adiciona um produto ao seu carrinho')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('ID do produto')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade do produto')
                .setRequired(false)
                .setMinValue(1)
        ),
    
    async execute(interaction) {
        const productId = interaction.options.getInteger('id');
        const quantidade = interaction.options.getInteger('quantidade') || 1;
        const userId = interaction.user.id;

        try {
            // Verificar se o produto existe
            const produto = await database.getProductById(productId);
            
            if (!produto) {
                const embed = new EmbedBuilder()
                    .setTitle('❌ Produto não encontrado')
                    .setDescription('O produto especificado não existe.')
                    .setColor(0xED4245);
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            // Verificar estoque
            if (produto.estoque < quantidade) {
                const embed = new EmbedBuilder()
                    .setTitle('📦 Estoque insuficiente')
                    .setDescription(`Apenas ${produto.estoque} unidades disponíveis.`)
                    .setColor(0xFEE75C);
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            // Adicionar ao carrinho
            await database.addToCart(userId, productId, quantidade);
            
            // Atualizar estoque
            await database.updateStock(productId, produto.estoque - quantidade);

            // Calcular total do carrinho
            const carrinho = await database.getCart(userId);
            const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

            const embed = new EmbedBuilder()
                .setTitle('✅ Produto adicionado ao carrinho!')
                .setDescription(`**${produto.nome}** foi adicionado ao seu carrinho.`)
                .addFields(
                    { name: 'Quantidade', value: quantidade.toString(), inline: true },
                    { name: 'Preço unitário', value: `$${produto.preco.toFixed(2)}`, inline: true },
                    { name: 'Total do carrinho', value: `$${total.toFixed(2)}`, inline: true }
                )
                .setColor(0x57F287)
                .setThumbnail(produto.imagem_url)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            await interaction.reply({
                content: '❌ Erro ao adicionar produto ao carrinho. Tente novamente.',
                ephemeral: true
            });
        }
    },
};
