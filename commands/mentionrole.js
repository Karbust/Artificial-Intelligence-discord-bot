const sendMSG = require('../functions-msg.js');
const { succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
    client.checkPermission("MANAGE_ROLES", message);
    let role = message.guild.roles.find(x => x.name === args.slice(0).join(" "));
    if (!role) return sendMSG.sendError(message.channel,"I couldn't find a role with that name!");
    if(!role.editable) return sendMSG.sendError(message.channel, "It seems like I `can't manage` this role! Please make sure I have a higher role than the role.");
    role.setMentionable(true, `${message.author.tag} wants to ping this role.`)
    .then(() => {
        sendMSG.sendMessage(`<@&${role.id}>`).then(() => {
            role.setMentionable(false, 'Role is pinged.').catch(console.error);
            succeeded(id);
        });
    }).catch(console.error);

};
exports.help = {
    name: "mentionrole",
    category: "Moderation",
    description: "Set mentionable of the role, then mention and and remove the mentionable.",
    usage: "mentionrole <roleName>"
  };