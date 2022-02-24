const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const mangaTools = require('../Helpers/mangadex.js')
const _ = require('lodash')


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
        
        const { title, coverLink, authors, altTitles, id } = await mangaTools.search(name)

        const exampleEmbed = {
            color: 0x0099ff,
            title: title,
            url: `https://mangadex.org/title/${id}`,
            author: {
                name: 'Search Result',
                icon_url: 'https://pbs.twimg.com/profile_images/1391016345714757632/xbt_jW78_400x400.jpg',
                url: 'https://discord.js.org',
            },
            // description: 'Some description here',
            thumbnail: {
                url: 'https://pbs.twimg.com/profile_images/1391016345714757632/xbt_jW78_400x400.jpg',
            },
            fields: [
                {
                    name: 'Author(s)',
                    value: authors.join(' - '),
                },

                {
                    name: 'Alt Titles',
                    value: altTitles.join(' '),
                },
                // {
                //     name: '\u200b',
                //     value: '\u200b',
                //     inline: false,
                // },
                // {
                //     name: 'Inline field title',
                //     value: 'Some value here',
                //     inline: true,
                // },
                // {
                //     name: 'Inline field title',
                //     value: 'Some value here',
                //     inline: true,
                // },
                // {
                //     name: 'Inline field title',
                //     value: 'Some value here',
                //     inline: true,
                // },
            ],
            image: {
                // url: coverLink,
                url: coverLink
            },
            timestamp: new Date(),
            footer: {
                text: id,
                icon_url: 'https://avatars.githubusercontent.com/u/47121483',
            },
        }

        var message = await interaction.reply({ embeds: [exampleEmbed], fetchReply: true })
        // await new Promise(resolve => setTimeout(resolve, 3000))
        // exampleEmbed.image.url = 'https://uploads.mangadex.org/covers/46e9cae5-4407-4576-9b9e-4c517ae9298e/97b244ef-5179-4e21-bbba-099c5f129bda.jpg'
        // message = await interaction.editReply({ embeds: [exampleEmbed], fetchReply: true })
        await message.react('⬅️').then(() => message.react('➡️'))
        // await message.react('➡️')

        const filter = (reaction, user) => {
            return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id != '888572800078602342'
        }
        const collector = message.createReactionCollector(filter, { time: 60000 })

        let imageIndex = 0
        collector.on('collect', async (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag} - user id: ${user.id}`)
            // var participantsIDs = ['142754694551437312', '870819788019097630', '186886181013684224']
            var participantsIDs = ['142754694551437312', '870819788019097630']
            participantsIDs.sort()
            if (reaction.emoji.name === '⬅️' && participantsIDs.includes(user.id)) {
                message.reactions.cache.map(async (reaction) => {
                    let usersThatReacted = []
                    if (reaction.emoji.name !== '⬅️') return
                    let reactedUsers = await reaction.users.fetch()
                    reactedUsers.map((user) => {
                        if(user.id != '888572800078602342') usersThatReacted.push(user.id)
                    })
                    console.log('usersThatReacted', usersThatReacted)
                    usersThatReacted.sort()
                    if (_.isEqual(participantsIDs, usersThatReacted)) {
                        if (imageIndex !== 0) {
                            imageIndex -= 1
                            exampleEmbed.image.url = coverLinkArray[imageIndex]
                            message = await interaction.editReply({ embeds: [exampleEmbed], fetchReply: true })
                        }
                        for (let i = 0; i < participantsIDs.length; i++) {
                            reaction.users.remove(participantsIDs[i])
                        }
                    }
                })


                // if (imageIndex !== 0) {
                //     imageIndex -= 1
                //     exampleEmbed.image.url = coverLinkArray[imageIndex]
                //     message = await interaction.editReply({ embeds: [exampleEmbed], fetchReply: true })
                // }
                // // message.reactions.resolve('⬅️').users.remove(interaction.user.id)
                // const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(interaction.user.id))
                // // console.log('message.reactions', message.reactions)
                // for (const reaction of userReactions.values()) {
                //     reaction.users.remove(interaction.user.id)
                // }
            } else if (reaction.emoji.name === '➡️' && participantsIDs.includes(user.id)) {
                message.reactions.cache.map(async (reaction) => {
                    let usersThatReacted = []
                    if (reaction.emoji.name !== '➡️') return
                    let reactedUsers = await reaction.users.fetch()
                    reactedUsers.map((user) => {
                        if(user.id != '888572800078602342') usersThatReacted.push(user.id)
                    })
                    console.log('usersThatReacted', usersThatReacted)
                    usersThatReacted.sort()
                    if (_.isEqual(participantsIDs, usersThatReacted)) {
                        if (imageIndex !== coverLinkArray.length - 1) {
                            imageIndex += 1
                            exampleEmbed.image.url = coverLinkArray[imageIndex]
                            message = await interaction.editReply({ embeds: [exampleEmbed], fetchReply: true })
                        }
                        for (let i = 0; i < participantsIDs.length; i++) {
                            reaction.users.remove(participantsIDs[i])
                        }
                    }
                })



                // if (imageIndex !== coverLinkArray.length - 1) {
                //     imageIndex += 1
                //     exampleEmbed.image.url = coverLinkArray[imageIndex]
                //     message = await interaction.editReply({ embeds: [exampleEmbed], fetchReply: true })
                // }
                // const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(interaction.user.id))
                // for (const reaction of userReactions.values()) {
                //     reaction.users.remove(interaction.user.id)
                // }
            }
            // const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(interaction.user.id))
            // for (const reaction of userReactions.values()) {
            //     reaction.users.remove(interaction.user.id)
            // }
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