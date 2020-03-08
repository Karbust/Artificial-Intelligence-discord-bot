const sendMSG = require('../functions-msg.js');
const { save,succeeded } = require('../functions');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
  if(!args[0]) return sendMSG.sendError(message.channel,"I couldn't find a role with that name!");
  let index = parseInt(args[0]) - 1;
  if(isNaN(index)) return sendMSG.sendError(message.channel,"That's not a valid timer number!");
  guildSchema.findOne({guild:message.guild.id}).then(guildData => {
    if(guildData.timers.length < index) return sendMSG.sendError(message.channel,"That's not a valid timer number!");
    guildData.timers.splice(index, 1)
    save(guildData, message);
    message.channel.send(`Removed the response from \`${args[0]}\`.`);
    succeeded(id);
  })
};
exports.help = {
    name: "removetimer",
    category: "Timers",
    description: "Remove a timer in the channel.",
    usage: "removetimer <number>"
  };