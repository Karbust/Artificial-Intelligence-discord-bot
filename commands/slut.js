const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const userSchema =  require('../mongodb/user');
const config = require('../config.json');
const { saveUser,succeeded } = require('../functions.js');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return sendMSG.sendError(message.channel,"It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
    userSchema.findOne({user: message.author.id}, function (err, userData) {
        if(!userData) userData = {user:message.author.id,votes:0,lastdaily:new Date('2010-12-31T23:59:59.999Z'),balance:0,lastwork:new Date('2010-12-31T23:59:59.999Z'),lastcrime:new Date('2010-12-31T23:59:59.999Z'),lastslut:new Date('2010-12-31T23:59:59.999Z')};
        if((new Date() - new Date(userData.lastslut)) < config.economy.slut.cooldown) return sendMSG.sendError(message.channel,"You can only slut once every 5 minutes!");
        userData.lastslut = Date.now();
        var embed = new discord.MessageEmbed()
        .setTitle("slut")
        .setFooter(config.footer);
        const chance = config.economy.slut.money.chance;
        const max = config.economy.slut.money.max;
        const min = config.economy.slut.money.min;
        const pos = config.economy.slut.positive;
        const neg = config.economy.slut.negative;
        if((Math.round(Math.random() * 100)) <= chance){
            var money = Math.round(Math.random() * max);
            embed.setColor(0x00ff00);
            embed.setDescription(pos[Math.floor(Math.random()*pos.length)] + '$' + money);
            userData.balance = userData.balance + money;
        } else {
            var money = Math.round(Math.random() * min);
            embed.setColor(0xff0000);
            embed.setDescription(neg[Math.floor(Math.random()*neg.length)] + '$' + money);
            userData.balance = userData.balance - money;
        }
        message.channel.send(embed);
        saveUser(userData, message);
        succeeded(id);
    })
};
exports.help = {
    name: "slut",
    category: "Economy",
    description: "Slut for money.",
    usage: "slut"
  };