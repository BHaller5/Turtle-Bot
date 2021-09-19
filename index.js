const { Client, Intents, Collection, Permissions } = require('discord.js')
const fs = require('fs')
require('dotenv').config()

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    console.log('Ready!')
    console.log(await client.guilds.cache.get(process.env.GUILD_ID)?.commands.fetch())
    const fullPermissions = [
        {
            id: '888812581517660210',
            permissions: [{
                id: '567478946317336589',
                type: 'ROLE',
                permission: true
            },
            {
                id: '870819788019097630',
                type: 'USER',
                permission: false
            }],
        },
        {
            id: '888841609553260585',
            permissions: [{
                id: '567478946317336589',
                type: 'ROLE',
                permission: true,
            },
            {
                id: '870819788019097630',
                type: 'USER',
                permission: true
            }],
        },
    ];
    
    await client.guilds.cache.get(process.env.GUILD_ID)?.commands.permissions.set({ fullPermissions });

});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set up a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
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