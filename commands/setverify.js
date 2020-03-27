const sendMSG = require('../functions-msg.js');
const {save, succeeded} = require('../functions');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('ADMINISTRATOR') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	const role = message.guild.roles.cache.find((x) => x.name === args.slice(0).join(' '));
	if (!role) return sendMSG.sendError(message.channel, `Incorrect usage, please type \`${prefix}help setverify\` for the usage!`);
	guildSchema.findOne({guild: message.guild.id}).then((guildData) => {
		guildData.verify = {channel: message.channel.id, role: role.id};
		save(guildData, message);
		succeeded(id);
		message.channel.send('This server uses verification, see https://youtu.be/oIDqs5Z8zF8 how to verify!').then(() => {
			message.channel.send('Verification set, please only delete this message!');
		});
	});
};
exports.help = {
	name: 'setverify',
	category: 'Welcome commands',
	description: 'Set the current channel as verification channel and set the verified member role. See https://youtu.be/oIDqs5Z8zF8 how verification works.',
	usage: 'setverify <roleName>'
};
