
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const database = require('../../utils/database');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkout')
        .setDescription('Finaliza a compra e gera link de pagamento'),
    
    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const carrinho = await database.getCart(userId);
            
            if (carrinho.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('🛒 Carrinho vazio')
                    .setDescription('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.')
                    .setColor(0xFEE75C);
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            // Calcular total
            const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

            // Preparar dados para API de pagamento
            const dadosPagamento = {
                cliente: {
                    id: userId,
                    nome: interaction.user.username
                },
                produtos: carrinho.map(item => ({
                    id: item.id,
                    nome: item.nome,
                    quantidade: item.quantidade,
                    preco: item.preco
                })),
                total: total
            };

            // Simular chamada para API de pagamento
            try {
                // Em um cenário real, você faria uma chamada real para a API
                // const response = await axios.post(`${process.env.URL_API_PAGAMENTO}/create-payment`, dadosPagamento);
                
                // Simulando resposta da API
                const linkPagamento = `https://pagamento.com/pay/${userId}-${Date.now()}`;

                const embed = new EmbedBuilder()
                    .setTitle('💳 Link de Pagamento Gerado')
                    .setDescription('Seu link de pagamento foi criado com sucesso!')
                    .addFields(
                        { name: 'Total a pagar', value: `$${total.toFixed(2)}`, inline: true },
                        { name: 'Link de pagamento', value: `[Clique aqui para pagar](${linkPagamento})`, inline: false }
                    )
                    .setColor(0x57F287)
                    .setTimestamp();

                // Enviar link por DM
                try {
                    await interaction.user.send({ embeds: [embed] });
                    await interaction.reply({
                        content: '📬 Link de pagamento enviado no seu privado!',
                        ephemeral: true
                    });
                } catch (dmError) {
                    // Se não conseguir enviar DM, responder no canal
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }

            } catch (apiError) {
                console.error('Erro na API de pagamento:', apiError);
                await interaction.reply({
                    content: '❌ Erro ao gerar link de pagamento. Tente novamente ou contate o suporte.',
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Erro no checkout:', error);
            await interaction.reply({
                content: '❌ Erro interno. Tente novamente.',
                ephemeral: true
            });
        }
    },
};
