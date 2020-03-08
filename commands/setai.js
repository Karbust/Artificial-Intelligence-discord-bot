const sendMSG = require('../functions-msg.js');
const { save, succeeded } = require('../functions.js');
const config = require('../config.json');
const guildSchema = require('../mongodb/guild');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return msgFunctions.sendError("PermissionError: You haven't enough permission to do this");
  if(!args[0]) return sendMSG.sendError(message.channel,"I am missing if you want to set it to true or false!");
  guildSchema.findOne({guild:message.guild.id}).then(guildData => {
    guildData.ai = args[0].toLowerCase() == 'true';
    save(guildData, message);
    message.channel.send(`Succesfull set it to \`${args[0].toLowerCase() == 'true'}\``)
    succeeded(id);
  });
};
exports.help = {
    name: "setai",
    category: "Moderation",
    description: "Set the automated things on or off.",
    usage: "setai <true/false>"
  };