const sendMSG = require('../functions-msg.js');
const { save,succeeded } = require('../functions');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
  if(!args[0]) return sendMSG.sendError(message.channel,`Incorrect usage, please type \`${prefix}help removecustomcommand\` for the usage!`);
  guildSchema.findOne({guild:message.guild.id}).then(guildData => {
    let obj = guildData.cc.find(o => o.command == args[0]);
    if(!obj) return sendMSG.sendError(message.channel,"Invalid custom command name! (Case sensitive)");
    let index = guildData.cc.findIndex(cc => cc.command === obj.command);
    guildData.cc.splice(index, 1);
    save(guildData, message);
    message.channel.send(`Removed the command \`${args[0]}\`.`);
    succeeded(id);
  })
};
exports.help = {
    name: "removecustomcommand",
    category: "Custom commands",
    description: "Remove a custom command.",
    usage: "removecustomcommands <commandName>"
  };