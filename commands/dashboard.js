const sendMSG = require('../functions-msg.js');
const {succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('ADMINISTRATOR') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	sendMSG.sendMessage(message.channel, `https://aibot.tk/server/${message.guild.id}`);
	succeeded(id);
};
exports.help = {
	name: 'dashboard',
	category: 'Information',
	description: "Get the server's dashboard.",
	usage: 'dashboard'
};
