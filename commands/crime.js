const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const userSchema =  require('../mongodb/user');
const config = require('../config.json');
const { saveUser,succeeded } = require('../functions.js');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return sendMSG.sendMessage(message.channel,"PermissionError: Missing `EMBED_LINKS` permission");
    userSchema.findOne({user: message.author.id}, function (err, userData) {
        if(!userData) userData = {user:message.author.id,votes:0,lastdaily:new Date('2010-12-31T23:59:59.999Z'),balance:0,lastwork:new Date('2010-12-31T23:59:59.999Z'),lastcrime:new Date('2010-12-31T23:59:59.999Z'),lastslut:new Date('2010-12-31T23:59:59.999Z')};
        if((new Date() - new Date(userData.lastcrime)) < config.economy.crime.cooldown) return sendMSG.sendMessage(message.channel,"TimeLimit: You can only crime once every 5 minutes");
        userData.lastcrime = Date.now();
        const chance = config.economy.crime.money.chance;
        const max = config.economy.crime.money.max;
        const min = config.economy.crime.money.min;
        const pos = config.economy.crime.positive;
        const neg = config.economy.crime.negative;
        if((Math.round(Math.random() * 100)) <= chance){
            var money = Math.round(Math.random() * max);
            userData.balance = userData.balance + money;
            sendMSG.sendEmbed(message.channel,"Crime",pos[Math.floor(Math.random()*pos.length)] + '$' + money,[],[],false);
        } else {
            var money = Math.round(Math.random() * min);
            userData.balance = userData.balance - money;
            sendMSG.sendEmbed(message.channel,"Crime",pos[Math.floor(Math.random()*pos.length)] + '$' + money,[],[],true);
        }
        saveUser(userData, message);
        succeeded(id);
    })
};
exports.help = {
    name: "crime",
    category: "Economy",
    description: "Crime for money.",
    usage: "crime"
  };