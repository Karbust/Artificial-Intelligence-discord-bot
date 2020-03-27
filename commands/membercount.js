const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const joinDataSchema = require('../mongodb/joinData');
const {sameDay, createGraph, normalize, succeeded} = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('ADMINISTRATOR') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	client.checkPermission('ATTACH_FILES', message);
	const now = new Date();
	const amountDays = !isNaN(args[0]) && args[0] <= 90 ? args[0] : 30;
	const memberCounts = [];
	const dates = [];
	const data = [];
	const xLabels = [];
	const yLabels = [];

	joinDataSchema.find({guild: message.guild.id, date: {$gte: new Date(now - 86400000 * amountDays)}}).then((joinData) => {
		for (let i = amountDays; i >= 0; i--) {
			let day = new Date(now - 86400000 * i);
			let count = joinData.filter((i) => sameDay(day, i.date));
			if (count[0]) {
				memberCounts.push(count[0].membercount);
				dates.push(`${count[0].date.getMonth() + 1}-${count[0].date.getDate()}-${count[0].date.getFullYear()}`);
			}
		}
		const lengthCount = memberCounts.length;
		const labels = Math.round(lengthCount / 3);
		const minCount = Math.min(...memberCounts);
		const maxCount = Math.max(...memberCounts);
		const rangeCount = maxCount - minCount;
		const sliceCount = rangeCount / labels;
		for (let i = 0; i <= labels; i++) {
			yLabels.push({value: i / labels, label: Math.round(minCount + i * sliceCount)});
		}

		const normalizedMemberCounts = normalize(memberCounts);
		for (let i = 0; i < lengthCount; i++) {
			let normalizedX = i / (lengthCount - 1);
			let normalizedY = normalizedMemberCounts[i];
			data.push({x: normalizedX, y: normalizedY});
			xLabels.push({value: normalizedX, label: dates[i]});
		}
		if (data.length < 2) return sendMSG.sendError(message.channel, "There isn't enough data to use this command!");
		const attachment = new discord.MessageAttachment(createGraph('Data', 'Member Count', 1920, 1080, data, xLabels, yLabels));
		sendMSG.sendEmbed(message.channel, 'MemberCount', 'chart by VimHax', [], [attachment], false);
		succeeded(id);
	});
};
exports.help = {
	name: 'membercount',
	category: 'Information',
	description: 'Get information about the membercount.',
	usage: 'membercount [days]'
};
