const { Client, Intents, Collection, Permissions } = require('discord.js')
const fs = require('fs')
require('dotenv').config()

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    console.log('Ready!')
    console.log(await client.guilds.cache.get(process.env.GUILD_ID)?.commands.fetch())
    const fullPermissions = [
        {
            // command id
            id: '945491744177401886',
            permissions: [{
                // role id
                id: '654526941193437195',
                type: 'ROLE',
                permission: false
            },
            {
                // user id
                id: '142754694551437312',
                type: 'USER',
                permission: true
            }],
        },
        {
            id: '945491744177401887',
            permissions: [{
                id: '654526941193437195',
                type: 'ROLE',
                permission: false
            },
            {
                id: '142754694551437312',
                type: 'USER',
                permission: true
            }],
        },
        {
            id: '945491744177401888',
            permissions: [{
                id: '654526941193437195',
                type: 'ROLE',
                permission: false
            },
            {
                id: '142754694551437312',
                type: 'USER',
                permission: true
            }],
        },
    ];
    
    await client.guilds.cache.get(process.env.GUILD_ID)?.commands.permissions.set({ fullPermissions })

});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    // Set up a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command)
    // console.log('things', client.commands)
}

console.log(client.commands.get('ping'))






client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName)
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN)