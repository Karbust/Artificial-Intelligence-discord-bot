const sendMSG = require('../functions-msg.js');
let regex = /.+:\d{2}/;
const {save, succeeded} = require('../functions.js');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('ADMINISTRATOR') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	if (!args[1]) return sendMSG.sendError(message.channel, 'UsageError: Missing the `time`(dd:hh:mm format) or `response`');
	let interval = args[0];
	if (interval.match(regex)) {
		const intervals = args[0].split(':');
		if (intervals.length == 3) {
			interval = intervals[0] * 86400000;
			interval = interval + intervals[1] * 3600000;
			interval = interval + intervals[2] * 60000;
		} else if (intervals.length == 2) {
			interval = intervals[1] * 3600000;
			interval = interval + intervals[2] * 60000;
		} else {
			sendMSG.sendError(message.channel, 'UsageError: Missing the `time`(dd:hh:mm format) or `response`');
		}
	} else {
		const intervalMultiplier = interval.charAt(interval.length - 1);
		interval = interval.substring(0, interval.length - 1);
		interval = intervalMultiplier == 'w' ? interval * 604800000 : interval;
		interval = intervalMultiplier == 'd' ? interval * 86400000 : interval;
		interval = intervalMultiplier == 'h' ? interval * 3600000 : interval;
		interval = intervalMultiplier == 'm' ? interval * 60000 : interval;
		interval = intervalMultiplier == 's' ? interval * 1000 : interval;
	}
	if (isNaN(interval)) return sendMSG.sendError(message.channel, 'UsageError: Invalid `time`(dd:hh:mm format)');
	guildSchema.findOne({guild: message.guild.id}).then((guildData) => {
		if (guildData.premium === false && guildData.timers.length >= 10) return sendMSG.sendError(message.channel, 'PremiumError: Maximum timers reached. Try to remove others');
		if (args.slice(1).join(' ').length > 1000) return sendMSG.sendError(message.channel, 'TimerError: Maximum responselength is 1000');
		if (interval < 60000) return sendMSG.sendError(message.channel, 'TimerError: Interval is faster than 1 minute');
		let newTimer = {channel: message.channel.id, response: args.slice(1).join(' '), interval: interval, last: Date.now()};
		guildData.timers.push(newTimer);
		save(guildData, message);
		sendMSG.sendMessage(message.channel, 'Saved the timer!');
		succeeded(id);
	});
};
exports.help = {
	name: 'addtimer',
	category: 'Timers',
	description: 'Add a timer in the channel.',
	usage: 'addtimer <time> <response> (time = dd:hh:mm)'
};
