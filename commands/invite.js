const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const { succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return sendMSG.sendError(message.channel,"It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
    sendMSG.sendEmbed(message.channel, "Invite", `[this bot](${config.invite})\n[support server](https://shortrsg.cf/discord)\n[site](https://aibot.tk)\n[survey](https://forms.gle/dXYieiWgaRVypK4d6)`, [], [], false);
    succeeded(id);
};
exports.help = {
  name: "invite",
  category: "Information",
  description: "Get the invite links of this bot.",
  usage: "invite"
};