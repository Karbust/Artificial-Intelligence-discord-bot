const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const {succeeded} = require('../functions');
const userSchema = require('../mongodb/user');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
		return sendMSG.sendError(message.channel, "It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
	userSchema.findOne({user: message.author.id}, function(err, userData) {
		if (!userData)
			userData = {
				user: message.author.id,
				votes: 0,
				lastdaily: new Date('2010-12-31T23:59:59.999Z'),
				balance: 0,
				lastwork: new Date('2010-12-31T23:59:59.999Z'),
				lastcrime: new Date('2010-12-31T23:59:59.999Z'),
				lastslut: new Date('2010-12-31T23:59:59.999Z')
			};
		const votes = userData.votes;
		const guilds = userData.guilds;
		const balance = userData.balance;
		const embed = new discord.MessageEmbed()
			.setTitle('Profile')
			.setColor(config.default.embed.color)
			.setFooter(config.footer)
			.addField('Votes', votes ? votes : 0)
			.addField('Invites for this bot', guilds ? guilds.length : 0)
			.addField('Balance', balance ? balance : 0);
		message.channel.send(embed);
		succeeded(id);
	});
};
exports.help = {
	name: 'profile',
	category: 'Economy',
	description: 'Get your profile.',
	usage: 'profile'
};
