const sendMSG = require('../functions-msg.js');
const {logcatch, succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('MANAGE_MESSAGES') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	if (!args.join(' ')) return sendMSG.sendError(message.channel, `Incorrect usage, please type \`${prefix}help say\` for the usage!`);
	const sayMessage = args.join(' ');
	if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
		message.delete().catch((err) => logcatch(err, message));
	}
	message.channel.send(sayMessage);
	succeeded(id);
};
exports.help = {
	name: 'say',
	category: 'Moderation',
	description: 'Let the bot send a message in the chat.',
	usage: 'say <response>'
};
