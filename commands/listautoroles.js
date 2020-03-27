const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const guildSchema = require('../mongodb/guild');
const {succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
		return sendMSG.sendError(message.channel, "It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
	guildSchema.findOne({guild: message.guild.id}).then((guildData) => {
		const autoroles = guildData.autorole;
		let fields = [];
		if (autoroles && autoroles.length !== 0) {
			let i = 0;
			for (i = 0; i < autoroles.length; i++) {
				let role = message.guild.roles.cache.get(autoroles[i]);
				fields.push({name: `Number: ${i + 1}`, value: `Autorole: \`${role ? role.name : 'Invalid role'}\``});
			}
			sendMSG.sendEmbed(message.channel, 'Listautoroles', '', fields, [], false);
			succeeded(id);
		} else {
			sendMSG.sendError(message.channel, 'No autoroles found');
		}
	});
};
exports.help = {
	name: 'listautoroles',
	category: 'Welcome commands',
	description: 'List the welcome roles.',
	usage: 'listautoroles'
};
