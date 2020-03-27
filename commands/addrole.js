const sendMSG = require('../functions-msg.js');
const {logcatch, succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('MANAGE_ROLES') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	client.checkPermission('MANAGE_ROLES', message);
	let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0]) : undefined;
	if (!member) return sendMSG.sendError(message.channel, 'MemberError: Invalid member mention or id');
	if (member.permissions.has('ADMINISTRATOR')) return sendMSG.sendError(message.channel, 'PermissionError: This user has more permission than you');
	if (!member.manageable) return sendMSG.sendError(message.channel, 'PermissionError: Cannot manage this member');
	const role = message.guild.roles.cache.find((x) => x.name === args.slice(1).join(' '));
	if (!role) return sendMSG.sendError(message.channel, "RoleError: Couldn't find the `roleName` (so not a mention)");
	if (!role.editable) return sendMSG.sendError(message.channel, 'PermissionError: Cannot manage this role');
	member.roles.add(role.id).catch((err) => logcatch(err, message));
	sendMSG.sendMessage(`${member.user.tag} has got the role ${role.name}`);
	succeeded(id);
};
exports.help = {
	name: 'addrole',
	category: 'Roles',
	description: 'Adds a role to a member.',
	usage: 'addrole <user> <roleName>'
};
