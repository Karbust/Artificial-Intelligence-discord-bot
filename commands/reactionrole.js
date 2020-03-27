const sendMSG = require('../functions-msg.js');
const reactionSchema = require('../mongodb/reaction');
const {succeeded} = require('../functions');
const config = require('../config.json');
const mongoose = require('mongoose');
const discord = require('discord.js');
let count = 0;
module.exports.run = async (prefix, client, message, args, id) => {
	if (!message.member.permissions.has('MANAGE_ROLES') && !config.whitelist.includes(message.author.id))
		return sendMSG.sendError(message.channel, "PermissionError: You haven't enough permission to do this");
	client.checkPermission('MANAGE_ROLES', message);
	saveRole(message, prefix);
	function saveRole(message, prefix) {
		message.channel.send(`Please type \`${prefix}role <roleName> (without <>)\` to enter the role you want. Or type \`${prefix}role stop\` to save the entered values.`).then((msg1) => {
			let filter = (m) => m.content.startsWith(`${prefix}role`) && m.author.id == message.author.id;
			message.channel
				.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
				.then((collected) => {
					let content = '';
					if (count >= 10) {
						content = 'stop';
					} else {
						content = collected.first().content.slice(prefix.length + 5);
					}
					if (content == 'stop') {
						collected.first().delete();
						msg1.delete();
						message.channel.send(`All emojis and roles are set, edit your \`${prefix}rr\` message to what you want (this will be the message people have to react) and you're done!`);
						return succeeded(id);
					} else {
						count++;
						let role = message.guild.roles.cache.find((r) => r.name.toLowerCase() == content.toLowerCase());
						if (role) {
							if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
								collected.first().delete();
								msg1.delete();
							}
							message.channel.send(`Please type \`${prefix}emoji <:emojiname:> (without <>)\` to enter the emoji you want for \`${role.name}\`.`).then((msg2) => {
								let filter = (m) => m.content.startsWith('/emoji') && m.author.id == message.author.id;
								message.channel
									.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
									.then((collected) => {
										let content = collected.first().content.slice(prefix.length + 6);
										let emoji = discord.Util.parseEmoji(content);
										if (emoji) {
											if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
												collected.first().delete();
												msg2.delete();
											}
											message.channel.send(`Saved the role ${role.name} with emoji ${emoji.id == null ? emoji.name : client.emojis.get(emoji.id)}`).then((msg3) => {
												let duck = new reactionSchema({
													_id: new mongoose.Types.ObjectId(),
													guild: message.guild.id,
													message: message.id,
													reaction: emoji.id == null ? emoji.name : emoji.id,
													role: role.id
												});
												duck.save().catch(console.error);
												saveRole(message, prefix);
												setTimeout(() => {
													msg3.delete();
												}, 1000);
											});
										} else {
											reactionSchema.deleteMany({message: message.id, guild: message.guild.id}, function(err) {
												if (err) console.log(err);
											});
											return message.channel.send('Invalid emoji. Cancelling command!');
										}
									})
									.catch((collected) => {
										if (collected.size == 0) {
											reactionSchema.deleteMany({message: message.id, guild: message.guild.id}, function(err) {
												if (err) console.log(err);
											});
											return message.channel.send('No response after 1m. Cancelling command');
										}
									});
							});
						} else {
							reactionSchema.deleteMany({message: message.id, guild: message.guild.id}, function(err) {
								if (err) console.log(err);
							});
							return message.channel.send('Invalid role. Cancelling command!');
						}
					}
				})
				.catch((collected) => {
					if (collected.size == 0) {
						reactionSchema.deleteMany({message: message.id, guild: message.guild.id}, function(err) {
							if (err) console.log(err);
						});
						return message.channel.send('No response after 1m. Cancelling command');
					}
				});
		});
	}
};
exports.help = {
	name: 'reactionrole',
	category: 'Roles',
	description: 'Set reaction roles up.',
	usage: 'reactionrole'
};
