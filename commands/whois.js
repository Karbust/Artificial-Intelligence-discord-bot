const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const {succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0]) : undefined;
	if (!member) return sendMSG.sendMessage(message.channel, 'MemberError: Invalid member mention or id');
	if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
		return sendMSG.sendError(message.channel, "It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
	let joined = new Intl.DateTimeFormat('en-US').format(member.joinedAt);
	let roles =
		member.roles
			.filter((r) => r.id !== message.guild.id)
			.map((r) => r)
			.join(', ') || 'none';
	let created = new Intl.DateTimeFormat('en-US').format(member.user.createdAt);
	let embed = new discord.MessageEmbed()
		.setThumbnail(member.user.displayAvatarURL)
		.setColor(config.default.embed.color)
		.addField('Member information:', `**Display name:** ${member.displayName}\n**Joined at:** ${joined}\n **Roles:** ${roles}`, true)
		.addField('User information:', `**ID:** ${member.user.id}\n**Username**: ${member.user.username}\n**Tag**: ${member.user.tag}\n**Created at**: ${created}`, true)
		.setFooter(config.footer);
	if (member.user.presence.game) embed.addField('Currently playing', `**Name:** ${member.user.presence.game.name}`);
	message.channel.send(embed);
	succeeded(id);
};
exports.help = {
	name: 'whois',
	category: 'Information',
	description: 'Get info about a member.',
	usage: 'whois <user>'
};
