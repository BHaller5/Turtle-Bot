const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const mangaTools = require('../Helpers/mangadex.js')

module.exports = {
	data: new SlashCommandBuilder()
        .setDefaultPermission(false)
		.setName('manga')
		.setDescription('Lookup a manga (name, author, year')
		.addStringOption(option => option.setName('name').setDescription('Account name.').setRequired(true))
        .addStringOption(option => option.setName('author').setDescription('Character name.').setRequired(false))
        .addStringOption(option => option.setName('year').setDescription('Class name.').setRequired(false)),
	async execute(interaction) {
        let name = interaction.options.getString('name')
        let author = interaction.options.getString('author')
        let year = interaction.options.getString('year')
		// console.log(interaction.options.getString('name'))
        // console.log(interaction.options.getString('author'))
        // console.log(interaction.options.getString('year'))
        
        const { title, coverLink } = await mangaTools.search(name)
        console.log('title', title)
        console.log('coverLink', coverLink)

        const exampleEmbed = {
            color: 0x0099ff,
            title: 'Some title',
            url: 'https://discord.js.org',
            author: {
                name: 'Some name',
                icon_url: 'https://i.imgur.com/AfFp7pu.png',
                url: 'https://discord.js.org',
            },
            description: 'Some description here',
            thumbnail: {
                url: 'https://i.imgur.com/AfFp7pu.png',
            },
            fields: [
                {
                    name: 'Regular field title',
                    value: 'Some value here',
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
            ],
            image: {
                url: coverLink,
            },
            timestamp: new Date(),
            footer: {
                text: 'Some footer text here',
                icon_url: 'https://i.imgur.com/AfFp7pu.png',
            },
        }

        var message = await interaction.reply({ embeds: [exampleEmbed] })
        await new Promise(resolve => setTimeout(resolve, 3000))
        exampleEmbed.image.url = 'https://uploads.mangadex.org/covers/46e9cae5-4407-4576-9b9e-4c517ae9298e/97b244ef-5179-4e21-bbba-099c5f129bda.jpg'
        message = await interaction.editReply({ embeds: [exampleEmbed], fetchReply: true })
        message.react('⬅️')
        message.react('➡️')

        const filter = (reaction, user) => {
            return reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️' && user.id === interaction.user.id
        }
        const collector = message.createReactionCollector({ filter, time: 10000 })

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`)
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(interaction.user.id))
            for (const reaction of userReactions.values()) {
                reaction.users.remove(interaction.user.id)
            }
        })
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`)
        })
		// await interaction.reply(`Your input:\n
        // Name: ${name}
        // Author: ${author}
        // Year: ${year}`
        // )

	},
};