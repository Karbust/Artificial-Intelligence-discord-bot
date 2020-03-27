const sendMSG = require('../functions-msg.js');
const {succeeded, logcatch} = require('../functions');
const userSchema = require('../mongodb/user');
module.exports.run = async (prefix, client, message, args, id) => {
	userSchema.findOne({user: message.author.id}, function(err, userData) {
		let guilds = userData ? userData.guilds : [];
		sendMSG.sendMessage(message.member, `Your code is ${message.author.id}. You have ${guilds.length} invites.`).catch((err) => logcatch(err, message));
		sendMSG.sendMessage(message.channel, 'Check your dm!');
		succeeded(id);
	});
};
exports.help = {
	name: 'getcode',
	category: 'Information',
	description: 'Get your invite code.',
	usage: 'getcode'
};
