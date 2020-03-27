const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const {succeeded, createGraph, normalize} = require('../functions');
const config = require('../config.json');
const usageSchema = require('../mongodb/usage.js');

module.exports.run = async (prefix, client, message, args, id) => {
	if (!config.whitelist.includes(message.author.id)) return;
	usageSchema.find({}).then((usageDatas) => {
		const xLabels = [];
		const yLabels = [];
		const data = [];

		const usages = [];
		usageDatas.forEach((usageData) => usages.push(usageData.command));
		usages.sort();

		const commandNames = [];
		const commandCounts = [];
		let prev;
		for (let i = 0; i < usages.length; i++) {
			if (usages[i] !== prev) {
				commandNames.push(usages[i]);
				commandCounts.push(1);
			} else {
				commandCounts[commandCounts.length - 1]++;
			}
			prev = usages[i];
		}
		const lengthCount = commandCounts.length;
		const labels = Math.round(lengthCount / 3);
		const minCount = Math.min(...commandCounts);
		const maxCount = Math.max(...commandCounts);
		const rangeCount = maxCount - minCount;
		const sliceCount = rangeCount / labels;
		for (let i = 0; i <= labels; i++) {
			yLabels.push({value: i / labels, label: Math.round(minCount + i * sliceCount)});
		}

		const normalizedCommandCounts = normalize(commandCounts);
		for (let i = 0; i < lengthCount; i++) {
			let normalizedX = i / (lengthCount - 1);
			let normalizedY = normalizedCommandCounts[i];
			data.push({x: normalizedX, y: normalizedY});
			xLabels.push({value: normalizedX, label: commandNames[i]});
		}
		const attachment = new discord.MessageAttachment(createGraph('Command', 'Amount', 1920, 1080, data, xLabels, yLabels));
		message.channel.send(attachment);
		succeeded(id);
	});
};
exports.help = {
	name: 'usage',
	category: 'Owner',
	description: 'Get information about the usage of commands.',
	usage: 'usage'
};
