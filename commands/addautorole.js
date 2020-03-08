const sendMSG = require('../functions-msg.js');
const { save, succeeded } = require('../functions.js');
const guildSchema = require('../mongodb/guild');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return msgFunctions.sendError("PermissionError: You haven't enough permission to do this");
  client.checkPermission("MANAGE_ROLES", message);
  if(!args[0]) return sendMSG.sendError(message.channel,"UsageError: Missing the `roleName` (so not a mention)");
  let role = message.guild.roles.cache.find(rl => rl.name == args.slice(0).join(' '));
  if(!role) return sendMSG.sendError(message.channel,"RoleError: Couldn't find the `roleName` (so not a mention)");
  guildSchema.findOne({guild:message.guild.id}).then(guildData => {
    if(guildData.autorole.includes(role)) return sendMSG.sendError(message.channel,"AutoRoleError: Can't add desame autorole");
    if(guildData.premium === false && guildData.autorole.length >= 5 || guildData.autorole.length >= 100) return sendMSG.sendError(message.channel,"PremiumError: Maximum autoroles reached. Try to remove others");
    guildData.autorole.push(role.id);
    save(guildData, message);
    sendMSG.sendMessage(message.channel,"Saved the autorole!");
    succeeded(id);
  })
};
exports.help = {
    name: "addautorole",
    category: "Welcome commands",
    description: "Add a welcome role.",
    usage: "addautorole <roleName>"
  };