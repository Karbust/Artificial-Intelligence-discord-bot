const sendMSG = require('../functions-msg.js');
const { save, succeeded } = require('../functions.js');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
  if(!args[1]) return sendMSG.sendError(message.channel,"UsageError: Missing the `commandName` or `response`");
  guildSchema.findOne({guild:message.guild.id}).then(guildData => {
    let obj = guildData.cc.find(o => o.command == args[0]);
    if(obj) return sendMSG.sendError(message.channel,"CustomCommandError: Can't add this commandName (already saved this name)");
    if(guildData.premium === false && guildData.cc.length >= 10) return sendMSG.sendError(message.channel,"PremiumError: Maximum custom commands reached. Try to remove others");
    if(args.slice(1).join(' ').length > 1000) return sendMSG.sendError(message.channel,"CustomCommandError: Maximum responselength is 1000")
    if(args[0].length > 100) return sendMSG.sendError(message.channel,"CustomCommandError: Maximum commandlength is 100")
    let newCc = {command: args[0], response: args.slice(1).join(' ')};
    guildData.cc.push(newCc);
    save(guildData, message);
    sendMSG.sendMessage(message.channel,"Saved the customm command")
    succeeded(id);
 })
};
exports.help = {
    name: "addcustomcommand",
    category: "Custom commands",
    description: "Add a custom command.",
    usage: "addcustomcommand <commandName> <response>"
  };