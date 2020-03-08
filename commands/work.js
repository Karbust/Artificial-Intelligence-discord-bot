const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const userSchema =  require('../mongodb/user');
const config = require('../config.json');
const { saveUser,succeeded } = require('../functions.js');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return sendMSG.sendError(message.channel,"It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
    userSchema.findOne({user: message.author.id}, function (err, userData) {
        if(!userData) userData = {user:message.author.id,votes:0,lastdaily:new Date('2010-12-31T23:59:59.999Z'),balance:0,lastwork:new Date('2010-12-31T23:59:59.999Z'),lastcrime:new Date('2010-12-31T23:59:59.999Z'),lastslut:new Date('2010-12-31T23:59:59.999Z')};
        if((new Date() - new Date(userData.lastwork)) < config.economy.work.cooldown) return sendMSG.sendError(message.channel,"You can only work once every 5 minutes!");
        userData.lastwork = Date.now();
        const max = config.economy.work.money.max;
        const pos = config.economy.work.positive;
        var embed = new discord.MessageEmbed()
        .setTitle("Work")
        .setFooter(config.footer);
        var money = Math.round(Math.random() * max);
        embed.setColor(0x00ff00);
        embed.setDescription(pos[Math.floor(Math.random()*pos.length)] + '$' + money);
        userData.balance = userData.balance + money;
        message.channel.send(embed);
        saveUser(userData, message);
        succeeded(id);
    })
};
exports.help = {
    name: "work",
    category: "Economy",
    description: "Work for money.",
    usage: "work"
  };