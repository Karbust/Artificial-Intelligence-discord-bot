const sendMSG = require('../functions-msg.js');
const {succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('MANAGE_NICKNAMES') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	client.checkPermission('MANAGE_NICKNAMES', message);
	let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0]) : undefined;
	if (!member) return sendMSG.sendMessage(message.channel, 'MemberError: Invalid member mention or id');
	if (member.permissions.has('ADMINISTRATOR')) return sendMSG.sendError(message.channel, 'PermissionError: This user has more permission than you');
	if (!member.manageable) return sendMSG.sendError(message.channel, "It seems like I can't manage this user! Please make sure I have a higher role than him.");
	const name = args.slice(1).join(' ');
	if (!name) return sendMSG.sendError(message.channel, 'Missing the name to set it to!');
	member.setNickname(name);
	sendMSG.sendError(message.channel, `${member.user.tag}'s name has been changed to: ${name}`);
	succeeded(id);
};
exports.help = {
	name: 'setname',
	category: 'Moderation',
	description: 'Sets a nickname of a member.',
	usage: 'setname <user> <nickname>'
};
