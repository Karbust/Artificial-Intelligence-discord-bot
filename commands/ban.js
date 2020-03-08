const sendMSG = require('../functions-msg.js');
const { logcatch,succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("BAN_MEMBERS") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
  let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(args[0]) ? message.guild.members.get(args[0]) : undefined;
  if(!member) return sendMSG.sendMessage(message.channel,"MemberError: Invalid member mention or id");
  if(member.permissions.has("ADMINISTRATOR")) return sendMSG.sendError(message.channel,"PermissionError: This user has more permission than you");
  if(!member.bannable) return sendMSG.sendError(message.channel,"PermissionError: Cannot ban this member");
  let reason = args.slice(1).join(' ') ? args.slice(1).join(' ') : config.default.reason;
  await member.ban(reason).catch(err => logcatch(err, message));
  sendMSG.sendMessage(`${member.user.tag} has been banned because: ${reason}`);
  succeeded(id);
};
exports.help = {
  name: "ban",
  category: "Moderation",
  description: "Ban a member.",
  usage: "ban <user> [reason]"
};