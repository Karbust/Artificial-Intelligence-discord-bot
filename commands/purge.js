const sendMSG = require('../functions-msg.js');
const { logcatch,succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.member.permissions.has("MANAGE_MESSAGES") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
    if(!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return sendMSG.sendError(message.channel,"It seems like I'm missing `MANAGE MESSAGES` permission! PLease give me this permission.");
    if(!message.channel.permissionsFor(message.guild.me).has("READ_MESSAGE_HISTORY")) return sendMSG.sendError(message.channel,"It seems like I'm missing `READ MESSAGE HISTORY` permission! PLease give me this permission.");
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100) return sendMSG.sendError(message.channel,"Please give a valid number! (min = 2, max = 100)");
    message.channel.bulkDelete(deleteCount).catch(err => logcatch(err, message));
    succeeded(id);
};
exports.help = {
    name: "purge",
    category: "Moderation",
    description: "Purge (clear) messages.",
    usage: "purge <number>"
  };