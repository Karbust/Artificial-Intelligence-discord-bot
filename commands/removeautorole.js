const sendMSG = require('../functions-msg.js');
const {save, succeeded} = require('../functions');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('ADMINISTRATOR') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	if (!args[0] || !args.slice(0).join(' ')) return sendMSG.sendError(message.channel, `Incorrect usage, please type \`${prefix}help removeautorole\` for the usage!`);
	let role = message.guild.roles.cache.find((rl) => rl.name == args.slice(0).join(' '));
	if (!role) return sendMSG.sendError(message.channel, "I couldn't find a role with that name!");
	guildSchema.findOne({guild: message.guild.id}).then((guildData) => {
		if (!guildData.autorole.includes(role)) return sendMSG.sendError(message.channel, "I couldn't find a role with that name (so don't mention it, but give the name)!");
		guildData.autorole = guildData.autorole.filter((roleX) => !roleX == role);
		save(guildData, message);
		message.channel.send(`Removed the autorole \`${role.name}\``);
		succeeded(id);
	});
};
exports.help = {
	name: 'removeautorole',
	category: 'Welcome commands',
	description: 'Remove a welcome role.',
	usage: 'removeautorole <roleName>'
};
