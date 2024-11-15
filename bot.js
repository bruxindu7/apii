const { Client,   
    SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const mongoClient = new MongoClient(process.env.MONGODB_URI);

async function connectToMongo() {
    try {
        await mongoClient.connect();
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

async function insertkey(key, userId, expirationDays) {
    try {
        const db = mongoClient.db('Cluster0');
        const keyCollection = db.collection('keys');
        const createdAt = new Date();

        await keyCollection.insertOne({ key, createdAt, userId, hwid: null, expirationDays });
    } catch (error) {
        console.error('Erro ao inserir chave:', error);
    }
}

client.on('messageCreate', async (message) => {
    if (message.content === '!painel') {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('api_button')
                .setLabel('Api')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('<:basededados:1306707175368032358>'),
            new ButtonBuilder()
                .setCustomId('logs_server')
                .setLabel('Logs')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:logs:1306708273189097472>'),
            new ButtonBuilder()
                .setCustomId('comands')
                .setLabel('Status')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:comando:1306708922010177567>')
        );

    const embed = new EmbedBuilder()
        .setColor('#1f8b4c')
        .setTitle('Painel Geral')
        .setDescription('Informações do painel')
        .setThumbnail('https://cdn.discordapp.com/attachments/1302314669318344826/1306616321580204095/9fa21bebc1d8521be3b8d661f4949967.png')
        .addFields(
            { name: 'Api', value: '\`\`\`Consultar comandos do banco de dados\`\`\`' },
            { name: 'Logs', value: ' \`\`\`Logs apps \`\`\`' },
            { name: 'Comandos dc', value: ' \`\`\`Consultar comandos do servidor\`\`\`' }
        )
        .setTimestamp()
        .setFooter({ text: 'Painel de Administração', iconURL: 'https://cdn.discordapp.com/attachments/1302314669318344826/1306616321580204095/9fa21bebc1d8521be3b8d661f4949967.png' });

    message.reply({ embeds: [embed], components: [row] });
}
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    // Verifica qual botão foi pressionado
    if (interaction.customId === 'api_button') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('api_button')
                    .setLabel('Status')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('<:basededados:1306707175368032358>'),
                new ButtonBuilder()
                    .setCustomId('loader_button')
                    .setLabel('Loader')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('<:logs:1306708273189097472>'),
                new ButtonBuilder()
                    .setCustomId('comands')
                    .setLabel('Bypass')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('<:comando:1306708922010177567>'),
            );

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setTitle('Informações da API')
            .setDescription('Aqui estão os detalhes e comandos disponíveis para a API:')
            .addFields(
                { name: ' ', value: '\`\`\`Status - Ver status da API\`\`\`' },
                { name: ' ', value: ' \`\`\`Loader - Interagir com o LOADER \`\`\`' },
                { name: ' ', value: ' \`\`\`Bypass - Interagir com o BYPASS\`\`\`' }
            )
            .setTimestamp()
            .setFooter({ text: 'Painel da API', iconURL: 'https://cdn.discordapp.com/attachments/1302314669318344826/1306616321580204095/9fa21bebc1d8521be3b8d661f4949967.png' });

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    if (interaction.customId === 'loader_button') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('gen_key')
                    .setLabel('Gerar Chave')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('<:mais:1306855548477640725>'),
                new ButtonBuilder()
                    .setCustomId('remove_key')
                    .setLabel('Remover Chave')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('<:logs:1306708273189097472>'),
                new ButtonBuilder()
                    .setCustomId('reset_hwid')
                    .setLabel('Resetar Hwid')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('<:comando:1306708922010177567>'),
                new ButtonBuilder()
                    .setCustomId('info_key')
                    .setLabel('Info Chave')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('<:basededados:1306707175368032358>')
            );
    
        const embed = new EmbedBuilder()
            .setColor('#3c00ff') // Cor de fundo da embed
            .setTitle('Painel de Comandos do Loader') // Título mais específico
            .setDescription('Aqui estão os comandos e detalhes disponíveis para interagir com o **Loader**:')
            .addFields(
                {
                    name: '**Gerar Chave**',
                    value: 'Clique para **gerar novas chaves** na API.'
                },
                {
                    name: '**Remover Chave**',
                    value: 'Clique para **remover chaves existentes** da API.'
                },
                {
                    name: '**Resetar Hwid**',
                    value: 'Clique para **resetar o serial de uma chave registrada**.'
                },
                {
                    name: '**Informações da Chave**',
                    value: 'Clique para **consultar detalhes sobre uma chave** registrada.'
                }
            )
            .setThumbnail('https://cdn.discordapp.com/attachments/1302314669318344826/1306616321580204095/9fa21bebc1d8521be3b8d661f4949967.png') // Imagem de fundo ou logo
            .setTimestamp()
            .setFooter({
                text: 'Painel de Administração do Loader',
                iconURL: 'https://cdn.discordapp.com/attachments/1302314669318344826/1306616321580204095/9fa21bebc1d8521be3b8d661f4949967.png'
            });
    
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'gen_key') {
        // Criando o modal para o tempo de expiração e quantidade
        const modal = new ModalBuilder()
            .setCustomId('generate_key_modal')
            .setTitle('Geração de Chave');

        // Campo para o tempo de expiração
        const expirationInput = new TextInputBuilder()
            .setCustomId('expiration_days')
            .setLabel('Dias de Expiração')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o número de dias de expiração')
            .setRequired(true);

        // Campo para a quantidade de chaves
        const quantityInput = new TextInputBuilder()
            .setCustomId('quantity')
            .setLabel('Quantidade de Chaves')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o número de chaves que deseja gerar')
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(3); // Limitar a quantidade de chaves de 1 a 999

        const row = new ActionRowBuilder().addComponents(expirationInput);
        const row2 = new ActionRowBuilder().addComponents(quantityInput);

        modal.addComponents(row, row2);

        await interaction.showModal(modal);
    }
});

// Captura a submissão do modal
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'generate_key_modal') {
        const expirationDays = interaction.fields.getTextInputValue('expiration_days');
        const quantity = parseInt(interaction.fields.getTextInputValue('quantity'), 10); // Número de chaves
        const userId = interaction.user.id;

        if (isNaN(quantity) || quantity <= 0) {
            return await interaction.reply({ content: 'Por favor, insira uma quantidade válida de chaves.', ephemeral: true });
        }

        // Gerando as chaves e inserindo no banco de dados
        let keys = [];
        for (let i = 0; i < quantity; i++) {
            const part1 = generateRandomString(8);
            const part2 = generateRandomString(6);
            const part3 = generateRandomString(6);
            const formattedKey = `MAJESTIC-${part1}-${part2}-${part3}`;

            // Inserir chave no banco de dados
            await insertkey(formattedKey, userId, expirationDays);
            keys.push(formattedKey);
        }

        // Enviando a resposta com as chaves geradas
        const keyEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Chaves Geradas')
            .setDescription(`**${quantity} chave(s) gerada(s):**\n${keys.join('\n')}`)
            .setFooter({ text: `Cada chave expira em ${expirationDays} dia(s) após o registro.` })
            .setTimestamp();

        await interaction.reply({ embeds: [keyEmbed], ephemeral: true });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'remove_key') {
        // Criando o modal para remover a chave
        const modal = new ModalBuilder()
            .setCustomId('remove_key_modal')
            .setTitle('Remover Chave');

        // Campo para inserir a chave
        const keyInput = new TextInputBuilder()
            .setCustomId('key_to_remove')
            .setLabel('Insira a chave para remover')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite a chave que deseja remover')
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(keyInput);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }

    if (interaction.customId === 'reset_hwid') {
        // Criando o modal para resetar o HWID
        const modal = new ModalBuilder()
            .setCustomId('reset_hwid_modal')
            .setTitle('Resetar HWID');

        // Campo para inserir a chave
        const keyInput = new TextInputBuilder()
            .setCustomId('key_to_reset_hwid')
            .setLabel('Insira a chave para resetar o HWID')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite a chave para resetar o HWID')
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(keyInput);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }

    if (interaction.customId === 'info_key') {
        // Criando o modal para obter informações sobre a chave
        const modal = new ModalBuilder()
            .setCustomId('info_key_modal')
            .setTitle('Informações da Chave');

        // Campo para inserir a chave
        const keyInput = new TextInputBuilder()
            .setCustomId('key_to_info')
            .setLabel('Insira a chave para obter informações')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite a chave para obter informações')
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(keyInput);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'remove_key_modal') {
        const keyToRemove = interaction.fields.getTextInputValue('key_to_remove');

        // Verificar se a chave existe no banco de dados
        const db = mongoClient.db('Cluster0');
        const keyCollection = db.collection('keys');

        const result = await keyCollection.deleteOne({ key: keyToRemove });

        if (result.deletedCount === 0) {
            return await interaction.reply({ content: 'Chave não encontrada.', ephemeral: true });
        }

        await interaction.reply({ content: 'Chave removida com sucesso.', ephemeral: true });
    }

    if (interaction.customId === 'reset_hwid_modal') {
        const keyToResetHwid = interaction.fields.getTextInputValue('key_to_reset_hwid');

        // Resetando o HWID para a chave fornecida
        const db = mongoClient.db('Cluster0');
        const keyCollection = db.collection('keys');

        const result = await keyCollection.updateOne(
            { key: keyToResetHwid },
            { $set: { hwid: null } }
        );

        if (result.modifiedCount === 0) {
            return await interaction.reply({ content: 'Chave não encontrada ou HWID já resetado.', ephemeral: true });
        }

        await interaction.reply({ content: 'HWID resetado com sucesso.', ephemeral: true });
    }

    if (interaction.customId === 'info_key_modal') {
        const keyToInfo = interaction.fields.getTextInputValue('key_to_info');

        // Consultando informações da chave no banco de dados
        const db = mongoClient.db('Cluster0');
        const keyCollection = db.collection('keys');
        const keyInfo = await keyCollection.findOne({ key: keyToInfo });

        if (!keyInfo) {
            return await interaction.reply({ content: 'Chave não encontrada.', ephemeral: true });
        }

        // Exibindo as informações da chave
        const infoEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Informações da Chave')
            .addFields(
                { name: 'Chave', value: keyInfo.key, inline: true },
                { name: 'Usuário', value: `<@${keyInfo.userId}>`, inline: true },
                { name: 'Dias de Expiração', value: `${keyInfo.expirationDays}`, inline: true },
                { name: 'Data de Criação', value: keyInfo.createdAt.toDateString(), inline: true },
                { name: 'HWID', value: keyInfo.hwid ? keyInfo.hwid : 'Não definido', inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    }
});

// Função para gerar uma string aleatória
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await connectToMongo();

   const commands = [
        new SlashCommandBuilder()
            .setName('key')
            .setDescription('Generate key')
            .addIntegerOption(option =>
                option.setName('expiration')
                    .setDescription('The expiration time in days for the key')
                    .setRequired(false)
            ),
            new SlashCommandBuilder()
            .setName('bypass_key') 
            .setDescription('Generate key for BYPASS')
            .addIntegerOption(option =>
                option.setName('expiration')
                    .setDescription('The expiration time in days for the key')
                    .setRequired(false)
            ),
        new SlashCommandBuilder()
            .setName('info')
            .setDescription('Get information about a key')
            .addStringOption(option =>
                option.setName('key')
                    .setDescription('The key to retrieve information for')
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('removekey')
            .setDescription('Remove Key')
            .addStringOption(option =>
                option.setName('key')
                    .setDescription('The key to remove')
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('resethwid')
            .setDescription('Reset HWID of a specific key')
            .addStringOption(option =>
                option.setName('key')
                    .setDescription('The key to reset the HWID for')
                    .setRequired(true)
            ),
    ];
    await client.application.commands.set(commands);
    console.log('Comandos registrados com sucesso.');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    try {
        if (interaction.commandName === 'key') {
            const expirationDays = interaction.options.getInteger('expiration') || 1;
            const amount = interaction.options.getInteger('amount') || 1;
            const userId = interaction.user.id;

            let keys = [];
            for (let i = 0; i < amount; i++) {
                const part1 = generateRandomString(8);
                const part2 = generateRandomString(6);
                const part3 = generateRandomString(6);
                const formattedkey = `REAPER-${part1}-${part2}-${part3}`;

                await insertkey(formattedkey, userId, expirationDays);
                keys.push(formattedkey);
            }

            const keyEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Chaves Geradas')
                .setDescription(`**${amount} chave(s) gerada(s):**\n${keys.join('\n')}`)
                .setFooter({ text: `Cada chave expira em ${expirationDays} dias após o registro.` })
                .setTimestamp();

            await interaction.reply({ embeds: [keyEmbed] });
        } else if (interaction.commandName === 'resethwid') {
            const key = interaction.options.getString('key');
            const db = mongoClient.db('Cluster0');
            const keyCollection = db.collection('keys');

            const result = await keyCollection.updateOne(
                { key },
                { $set: { hwid: null } }
            );

            if (result.modifiedCount === 0) {
                return await interaction.reply({ content: 'Key not found or HWID already reset.', ephemeral: true });
            }

            await interaction.reply({ content: 'HWID has been reset successfully.', ephemeral: true });
        } else if (interaction.commandName === 'removekey') {
            const key = interaction.options.getString('key');
            const db = mongoClient.db('Cluster0');
            const keyCollection = db.collection('keys');

            const result = await keyCollection.deleteOne({ key });

            if (result.deletedCount === 0) {
                return await interaction.reply({ content: 'Key not found.', ephemeral: true });
            }

            await interaction.reply({ content: 'Key has been removed successfully.', ephemeral: true });
  } else if (interaction.commandName === 'info') {
            const key = interaction.options.getString('key');
            const db = mongoClient.db('Cluster0');
            const keyCollections = ["Keys", "BypassKeys"];

            let keyInfo = null;
            let collectionName = null;

            for (const collection of keyCollections) {
                const collectionData = db.collection(collection);
                keyInfo = await collectionData.findOne({ key });

                if (keyInfo) {
                    collectionName = collection;
                    break;
                }
            }

            if (!keyInfo) {
                return await interaction.reply({ content: 'Chave não encontrada em nenhuma coleção.', ephemeral: true });
            }

            const infoEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Informações da Chave')
                .addFields(
                    { name: 'Chave', value: keyInfo.key, inline: true },
                    { name: 'Usuário', value: `<@${keyInfo.userId}>`, inline: true },
                    { name: 'Dias de Expiração', value: `${keyInfo.expirationDays}`, inline: true },
                    { name: 'Data de Criação', value: keyInfo.createdAt.toDateString(), inline: true },
                    { name: 'Coleção', value: collectionName, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [infoEmbed] });

        }
    } catch (error) {
        console.error('Error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
