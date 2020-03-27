const sendMSG = require('../functions-msg.js');
const {logcatch, succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('MANAGE_CHANNELS') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	client.checkPermission('MANAGE_CHANNELS', message);
	let perms = [{type: 'role', id: message.guild.id, deny: 3072}];
	message.mentions.users.forEach((user) => perms.push({type: 'user', id: user.id, allow: 3072}));
	message.guild.channels
		.create('Private-room', {permissionOverwrites: perms})
		.then((channel) => sendMSG.sendError(message.channel, `Created ${channel}`))
		.catch((err) => logcatch(err, message));
	succeeded(id);
};
exports.help = {
	name: 'openroom',
	category: 'Moderation',
	description: 'Open a private room to talk with the mentioned users.',
	usage: 'openroom <@user> <@user> <@user> ...'
};
