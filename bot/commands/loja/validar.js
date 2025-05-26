
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const database = require('../../utils/database');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('validar')
        .setDescription('Valida o status do seu pagamento'),
    
    async execute(interaction) {
        const userId = interaction.user.id;

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`validar_pagamento_${userId}`)
                    .setLabel('✅ Validar Pagamento')
                    .setStyle(ButtonStyle.Success)
            );

        const embed = new EmbedBuilder()
            .setTitle('🔍 Validação de Pagamento')
            .setDescription('Clique no botão abaixo para verificar o status do seu pagamento.')
            .setColor(0x5865F2);

        await interaction.reply({ embeds: [embed], components: [button], ephemeral: true });

        // Listener para o botão
        const filter = i => i.customId === `validar_pagamento_${userId}` && i.user.id === userId;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            try {
                // Simular verificação de pagamento na API
                // const response = await axios.get(`${process.env.URL_API_PAGAMENTO}/check-payment/${userId}`);
                
                // Simulando status aprovado (em produção, viria da API)
                const statusPagamento = Math.random() > 0.3 ? 'aprovado' : 'pendente';

                if (statusPagamento === 'aprovado') {
                    // Limpar carrinho após pagamento confirmado
                    await database.clearCart(userId);

                    const successEmbed = new EmbedBuilder()
                        .setTitle('🎉 Pagamento Confirmado!')
                        .setDescription(`Obrigado pela compra, ${i.user}!\nSeu pedido foi processado com sucesso.`)
                        .setColor(0x57F287)
                        .setTimestamp();

                    await i.update({ embeds: [successEmbed], components: [] });
                } else {
                    const pendingEmbed = new EmbedBuilder()
                        .setTitle('⏳ Pagamento Pendente')
                        .setDescription('Seu pagamento ainda está sendo processado. Tente novamente em alguns minutos.')
                        .setColor(0xFEE75C);

                    await i.update({ embeds: [pendingEmbed], components: [button] });
                }
            } catch (error) {
                console.error('Erro ao validar pagamento:', error);
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌ Erro na Validação')
                    .setDescription('Ocorreu um erro ao verificar seu pagamento. Tente novamente ou contate o suporte.')
                    .setColor(0xED4245);

                await i.update({ embeds: [errorEmbed], components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                console.log('Timeout na validação de pagamento');
            }
        });
    },
};
