const sendMSG = require('../functions-msg.js');
const {save, succeeded} = require('../functions');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('ADMINISTRATOR') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	guildSchema.findOne({guild: message.guild.id}).then((guildData) => {
		if (!guildData.leave.channel) return sendMSG.sendError(message.channel, 'You never set this!');
		guildData.leave = {};
		save(guildData, message);
		message.channel.send(`Leave message removed!.`);
		succeeded(id);
	});
};
exports.help = {
	name: 'removeleave',
	category: 'Welcome commands',
	description: 'Remove the leave message.',
	usage: 'removeleave'
};
