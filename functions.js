const mongoose = require('mongoose');
const {createCanvas} = require('canvas');
const sendMSG = require('./functions-msg.js');
const guildSchema = require('./mongodb/guild.js');
const userSchema = require('./mongodb/user.js');
const usageSchema = require('./mongodb/usage');
function logcatch(err, message) {
	sendMSG.sendError(message.channel, err);
}
/**
 * @param {string} err - The error message
 * @param {object} message - The message object
 */
module.exports.logcatch = function(err, message) {
	sendMSG.sendError(message.channel, err);
};

/**
 * @param {string} string - The string to transform text
 */
module.exports.textTransform = function(string) {
	return string
		.toUpperCase()
		.split('')
		.join(' ');
};

/**
 * @param {date} d1 - The first date
 * @param {data} d2 - The second date
 */
module.exports.sameDay = function(d1, d2) {
	return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};

/**
 * @param {object} guildData - The data to save
 * @param {object} message - The message object
 */
module.exports.save = function(guildData, message) {
	const duck = new guildSchema({
		_id: new mongoose.Types.ObjectId(),
		guild: message.guild.id,
		cc: guildData.cc,
		timers: guildData.timers,
		autorole: guildData.autorole,
		verify: guildData.verify,
		join: guildData.join,
		leave: guildData.leave,
		ai: guildData.ai,
		prefix: guildData.prefix,
		premium: guildData.premium,
		inviteCode: guildData.inviteCode
	});
	if (!guildData || guildData == []) {
		return duck.save().catch((err) => logcatch(err, message));
	} else {
		guildSchema.deleteOne({guild: message.guild.id}).catch((err) => logcatch(err, message));
		return duck.save().catch((err) => logcatch(err, message));
	}
};

/**
 * @param {object} userData - The data to save
 * @param {object} message - The message object
 */
module.exports.saveUser = function(userData, message) {
	const duck = new userSchema({
		_id: new mongoose.Types.ObjectId(),
		user: userData.user,
		votes: userData.votes ? userData.votes : 0,
		lastdaily: userData.lastdaily ? userData.lastdaily : new Date('2010-12-31T23:59:59.999Z'),
		guilds: userData.guilds ? userData.guilds : [],
		balance: userData.balance ? userData.balance : 0,
		lastwork: userData.lastwork ? userData.lastwork : new Date('2010-12-31T23:59:59.999Z'),
		lastcrime: userData.lastcrime ? userData.lastcrime : new Date('2010-12-31T23:59:59.999Z'),
		lastslut: userData.lastslut ? userData.lastslut : new Date('2010-12-31T23:59:59.999Z')
	});
	if (!userData || userData == []) {
		return duck.save().catch((err) => logcatch(err, message));
	} else {
		userSchema.deleteOne({user: userData.user}).catch((err) => logcatch(err, message));
		return duck.save().catch((err) => logcatch(err, message));
	}
};

/**
 * @param {string} id - The mongoose id
 */
module.exports.succeeded = function(id) {
	usageSchema.findById(id, function(err, usage) {
		if (usage) {
			usage.succeeded = true;
			return usage.save();
		}
	});
};

/**
 * @param {array} array - The array to normalize
 */
module.exports.normalize = function(array) {
	let range = Math.max(...array) - Math.min(...array);
	return array.map((e) => e - Math.min(...array)).map((e) => e / range);
};

module.exports.createGraph = function(x, y, width, height, data, xLabels, yLabels) {
	const F_SIZE = 30;
	const F_OFFSET = 5;
	const L_PAD = F_SIZE * 3;
	const B_PAD = F_SIZE * 3;

	const textTransform = (text) =>
		text
			.toUpperCase()
			.split('')
			.join(' ');

	x = textTransform(x);
	y = textTransform(y);

	const canvas = createCanvas(200, 200);
	const ctx = canvas.getContext('2d');

	ctx.font = `${F_SIZE}px Arial`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const maxXL = Math.max(...xLabels.map((e) => ctx.measureText(e.label).width));
	const maxYL = Math.max(...yLabels.map((e) => ctx.measureText(e.label).width));

	let R_PAD = 2 * F_SIZE + maxYL;
	let T_PAD = 2 * F_SIZE + maxXL;
	if (R_PAD < L_PAD) R_PAD = L_PAD;
	if (T_PAD < B_PAD) T_PAD = B_PAD;

	const WIDTH = L_PAD + width + R_PAD;
	const HEIGHT = T_PAD + height + B_PAD;

	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx.font = `${F_SIZE}px Arial`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	// Background //

	ctx.fillStyle = '#0f0f0f'; // white
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	// Grid & Labels //

	const xGrid = xLabels.map((e) => e.value * width + L_PAD);
	const yGrid = yLabels.map((e) => height - e.value * height + T_PAD);

	ctx.fillStyle = 'white'; // white
	ctx.strokeStyle = '#666';
	ctx.textAlign = 'left';

	ctx.beginPath();

	xGrid.forEach((grid, i) => {
		ctx.moveTo(grid, T_PAD);
		ctx.lineTo(grid, T_PAD + height);
		ctx.save();
		ctx.translate(grid + F_OFFSET, T_PAD - F_SIZE);
		ctx.rotate(-90 * (Math.PI / 180));
		ctx.fillText(xLabels[i].label, 0, 0);
		ctx.restore();
	});

	yGrid.forEach((grid, i) => {
		ctx.moveTo(L_PAD, grid);
		ctx.lineTo(L_PAD + width, grid);
		ctx.fillText(yLabels[i].label, WIDTH - R_PAD + F_SIZE, grid + F_OFFSET);
	});

	ctx.stroke();

	// Data //

	ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';

	ctx.beginPath();
	ctx.moveTo(L_PAD, T_PAD + height);

	data.map((e) => {
		return {
			x: e.x * width + L_PAD,
			y: height - e.y * height + T_PAD
		};
	}).forEach((d) => {
		ctx.lineTo(d.x, d.y);
	});

	ctx.lineTo(L_PAD + width, T_PAD + height);
	ctx.lineTo(L_PAD, T_PAD + height);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Axes //

	ctx.lineWidth = 2;
	ctx.fillStyle = 'white'; // black
	ctx.strokeStyle = 'white'; // black
	ctx.textAlign = 'center';

	ctx.beginPath();
	ctx.moveTo(L_PAD, T_PAD);
	ctx.lineTo(L_PAD, HEIGHT - B_PAD);
	ctx.lineTo(WIDTH - R_PAD, HEIGHT - B_PAD);
	ctx.stroke();

	ctx.fillText(x, L_PAD + width / 2, HEIGHT - (B_PAD / 2 - F_OFFSET));

	ctx.save();
	ctx.translate(L_PAD / 2 + F_OFFSET, T_PAD + height / 2);
	ctx.rotate(-90 * (Math.PI / 180));
	ctx.fillText(y, 0, 0);
	ctx.restore();

	return canvas.toBuffer();
};
