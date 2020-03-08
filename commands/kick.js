const sendMSG = require('../functions-msg.js');
const { logcatch, succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.member.permissions.has("KICK_MEMBERS") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
    let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(args[0]) ? message.guild.members.get(args[0]) : undefined;
    if(!member) return sendMSG.sendMessage(message.channel,"MemberError: Invalid member mention or id");
    if(member.permissions.has("ADMINISTRATOR")) return sendMSG.sendError(message.channel,"PermissionError: This user has more permission than you");
    if(!member.kickable) return sendMSG.sendError(message.channel, "It seems like I `can't kick` this user! Please make sure I have a higher role than him.");
    let reason = args.slice(1).join(' ') ? args.slice(1).join(' ') : config.default.reason;
    await member.kick(reason).catch(err => logcatch(err, message));
    sendMSG.sendMessage(message.channel,`${member.user.tag} has been kicked because: ${reason}`);
    succeeded(id);
};
exports.help = {
    name: "kick",
    category: "Moderation",
    description: "Kick a member.",
    usage: "kick <user> [reason]"
  };