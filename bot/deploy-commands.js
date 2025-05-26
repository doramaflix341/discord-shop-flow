
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];

// Ler todos os comandos das pastas
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] Comando em ${filePath} está faltando propriedades "data" ou "execute".`);
        }
    }
}

// Construir e preparar uma instância do módulo REST
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy dos comandos
(async () => {
    try {
        console.log(`🔄 Iniciando refresh de ${commands.length} comandos de aplicação (/).`);

        // O método put é usado para registrar completamente todos os comandos
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Recarregados com sucesso ${data.length} comandos de aplicação (/).`);
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
})();
