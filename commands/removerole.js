const sendMSG = require('../functions-msg.js');
const { logcatch,succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.member.permissions.has("MANAGE_ROLES") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
    let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(args[0]) ? message.guild.members.get(args[0]) : undefined;
    if(!member) return sendMSG.sendMessage(message.channel,"MemberError: Invalid member mention or id");
    if(member.permissions.has("ADMINISTRATOR")) return sendMSG.sendError(message.channel,"PermissionError: This user has more permission than you");
    if(!member.manageable) return sendMSG.sendError(message.channel,"It seems like I can't manage this user! Please make sure I have a `higher role than him` and I have `MANAGE ROLES` permission.");
    var role = message.guild.roles.find(x => x.name === args.slice(1).join(" "));
    if (!role) return sendMSG.sendError(message.channel,"I couldn't find a role with that name (so don't mention it, but give the name)!");
    if(!role.editable) return sendMSG.sendError(message.channel,"It seems like I `can't manage` this role! Please make sure I have a `higher role than` the role.");
    member.roles.remove(role.id).catch(err => logcatch(err, message));
    sendMSG.sendError(message.channel,`${member.user.tag} hasn't got the role ${role.name} anymore`);
    succeeded(id);
};
exports.help = {
    name: "removerole",
    category: "Roles",
    description: "Removes a role to a member.",
    usage: "removerole <user> <roleName>"
  };