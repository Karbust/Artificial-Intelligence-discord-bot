const sendMSG = require('../functions-msg.js');
const request = require('request');
const prettyMilliseconds = require('pretty-ms');
const {saveUser, succeeded} = require('../functions');
const userSchema = require('../mongodb/user.js');
module.exports.run = async (prefix, client, message, args, id) => {
	const options = {
		url: `https://discordbots.org/api/bots/543071379294126080/check?userId=${message.author.id}`,
		headers: {
			Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0MzA3MTM3OTI5NDEyNjA4MCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTU2ODgwMzUyfQ.oWHa_gLTd0HNcXTdDLZRQN3esNL2kY-3XTC0o2ovG-8'
		}
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			if (JSON.parse(body, 'utf8')['voted'] == 1) {
				userSchema.findOne({user: message.author.id}, function(err, userData) {
					let votes = userData ? userData.votes : 0;
					if (userData) {
						if (userData.lastdaily > Date.now() - '43200000') {
							return sendMSG.sendError(
								message.channel,
								`TimeLimit: You already claimed this! (you can vote again at ${prettyMilliseconds('43200000' - (Date.now() - userData.lastdaily))})`
							);
						}
					} else {
						userData = {user: message.author.id, votes: 0};
					}
					userData.lastdaily = new Date();
					userData.votes = userData ? userData.votes + 1 : 1;
					saveUser(userData);
					sendMSG.sendMessage(message.channel, `You succesfully voted (${votes + 1} total)`);
					succeeded(id);
				});
			} else {
				sendMSG.sendError(message.channel, 'VoteError: Seems like your forgot to vote at https://top.gg/bot/543071379294126080/vote');
			}
		} else {
			sendMSG.sendError(message.channel, 'VoteError: Seems like your forgot to vote at https://top.gg/bot/543071379294126080/vote');
		}
	}
	request(options, callback);
};
exports.help = {
	name: 'daily',
	category: 'Information',
	description: 'Claim your daily credits.',
	usage: 'daily'
};
