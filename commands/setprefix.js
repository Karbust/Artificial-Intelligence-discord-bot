const sendMSG = require('../functions-msg.js');
const {save, succeeded} = require('../functions');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('ADMINISTRATOR') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	if (!args[0]) return sendMSG.sendError(message.channel, `Incorrect usage, please type \`${prefix}help setprefix\` for the usage!`);
	guildSchema.findOne({guild: message.guild.id}).then((guildData) => {
		guildData.prefix = args[0];
		save(guildData, message);
		message.channel.send(`Prefix changed!`);
		succeeded(id);
	});
};
exports.help = {
	name: 'setprefix',
	category: 'Moderation',
	description: 'Change the prefix of the server.',
	usage: 'setprefix <prefix>'
};
