const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setDefaultPermission(false)
		.setName('update_all')
		.setDescription('Updates all player attributes (account, character, class, level, ilevel')
		.addStringOption(option => option.setName('account').setDescription('Account name.').setRequired(true))
        .addStringOption(option => option.setName('character').setDescription('Character name.').setRequired(true))
        .addStringOption(option => option.setName('class').setDescription('Class name.').setRequired(true))
        .addIntegerOption(option => option.setName('level').setDescription('Character level.').setRequired(true))
        .addIntegerOption(option => option.setName('ilevel').setDescription('Item level.').setRequired(true)),
	async execute(interaction) {    
		console.log(interaction.options.getString('account'))
        console.log(interaction.options.getString('character'))
        console.log(interaction.options.getString('class'))
        console.log(interaction.options.getInteger('level'))
        console.log(interaction.options.getInteger('ilevel'))
		await interaction.reply(`Your input:\n
        Account: ${interaction.options.getString('account')}
        Character: ${interaction.options.getString('character')}
        Class: ${interaction.options.getString('class')}
        Level: ${interaction.options.getInteger('level')}
        iLevel: ${interaction.options.getInteger('ilevel')}`);
	},
};