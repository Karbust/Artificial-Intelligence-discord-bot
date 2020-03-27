const sendMSG = require('../functions-msg.js');
const {succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('MANAGE_MESSAGES') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0]) : undefined;
	if (!member) return sendMSG.sendMessage(message.channel, 'MemberError: Invalid member mention or id');
	if (member.permissions.has('ADMINISTRATOR')) return sendMSG.sendError(message.channel, 'PermissionError: This user has more permission than you');
	let reason = args.slice(1).join(' ') ? args.slice(1).join(' ') : config.default.reason;
	await sendMSG.sendMessage(member, `You're warned because: ${reason}`);
	sendMSG.sendError(message.channel, `${member.user.tag} has been warned because: ${reason}`);
	succeeded(id);
};
exports.help = {
	name: 'warn',
	category: 'Moderation',
	description: 'Warn a member.',
	usage: 'warn <user> [reason]'
};
