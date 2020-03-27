const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const guildSchema = require('../mongodb/guild');
const {succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
		return sendMSG.sendError(message.channel, "It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
	guildSchema.findOne({guild: message.guild.id}).then((guildData) => {
		const timers = guildData.timers;
		let fields = [];
		if (timers && timers.length !== 0) {
			let i = 0;
			for (i = 0; i < timers.length; i++) {
				let channel = message.guild.channels.cache.get(guildData.timers[i].channel);
				let interval = guildData.timers[i].interval;
				let response = guildData.timers[i].response;
				fields.push({name: `Channel: ${channel ? channel.name : 'Invalid channel'} every ${prettyMilliseconds(interval)}`, value: `${i + 1}. Response: \`${response}\``});
			}
			sendMSG.sendEmbed(message.channel, 'Listtimers', '', fields, [], false);
			succeeded(id);
		} else {
			sendMSG.sendError(message.channel, 'No timers found');
		}
	});
};
exports.help = {
	name: 'listtimers',
	category: 'Timers',
	description: 'List of all the timers.',
	usage: 'listtimers'
};
