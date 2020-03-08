const sendMSG = require('../functions-msg.js');
const { save,succeeded } = require('../functions');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
  if(!args.slice(0).join(" ") || args.slice(0).join(" ").length > 1000) return sendMSG.sendError(message.channel,"You can't set it longer than 1000 characters!");
  guildSchema.findOne({guild:message.guild.id}).then(guildData => {
    guildData.leave = {channel: message.channel.id, message: args.slice(0).join(" ")};
    save(guildData, message);
    message.channel.send(`Leave message set in this channel!.`);
    succeeded(id);
  })
};
exports.help = {
    name: "setleave",
    category: "Welcome commands",
    description: "Set the current channel as welcome channel and set the leave message.",
    usage: "setleave <response>"
  };