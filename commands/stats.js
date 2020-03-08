const sendMSG = require('../functions-msg.js');
const discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const { succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const embed = new discord.MessageEmbed()
    .setTitle("Statistics")
    .setColor(config.default.embed.color)
    .addField("Memory usage", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB")
    .addField("Uptime", duration)
    .addField("Users", client.users.size.toLocaleString())
    .addField("Channels", client.channels.size.toLocaleString())
    .addField("server", client.guilds.size.toLocaleString())
    .addField("discord.js", "v" + discord.version)
    .addField("Node", process.version)
    .setFooter(config.footer)
  message.channel.send(embed);
  succeeded(id);
};
exports.help = {
  name: "stats",
  category: "Info",
  description: "Bot statistics.",
  usage: "stats"
};