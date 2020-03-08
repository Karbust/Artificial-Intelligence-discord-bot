const sendMSG = require('../functions-msg.js');
const { logcatch,succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("MANAGE_ROLES") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
  client.checkPermission("MANAGE_ROLES", message);
  let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(args[0]) ? message.guild.members.get(args[0]) : undefined;
  if(!member) return sendMSG.sendError(message.channel,"Please give a valid member of this server!")
  if(member.permissions.has("ADMINISTRATOR")) return sendMSG.sendError(message.channel,"PermissionError: This user has more permission than you");
  if(message.guild.roles.find(role => role.name == "mute") && !role){ var role = message.guild.roles.find(role => role.name == "mute") }
  else if(message.guild.roles.find(role => role.name == "Mute") && !role){ var role = message.guild.roles.find(role => role.name == "Mute") }
  else if(message.guild.roles.find(role => role.name == "muted") && !role){ var role = message.guild.roles.find(role => role.name == "muted") }
  else if(message.guild.roles.find(role => role.name == "Muted") && !role){ var role = message.guild.roles.find(role => role.name == "Muted") };
  if(!member.manageable) return sendMSG.sendError(message.channel,"It seems like I `can't manage` this user! Please make sure I have a higher role than him.");
  if(role) { await member.roles.remove(role.id).catch(err => logcatch(err, message)); message.channel.send(`${member.user.tag} is unmuted!`); succeeded(id)};
  if(!role) { logcatch("No mute role (mute/muted) found", message)};
};
exports.help = {
  name: "unmute",
  category: "Moderation",
  description: "Unmute a member.",
  usage: "unmute <user>"
};