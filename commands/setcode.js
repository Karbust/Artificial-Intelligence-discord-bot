const sendMSG = require('../functions-msg.js');
const userSchema =  require('../mongodb/user');
const guildSchema = require('../mongodb/guild');
const { save, saveUser,succeeded } = require('../functions.js');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.member.permissions.has("ADMINISTRATOR") && !config.whitelist.includes(message.author.id)) return sendMSG.sendError(message.channel,"PermissionError: You haven't enough permission to do this");
    guildSchema.findOne({guild:message.guild.id}).then(guildData => {
        if(guildData.inviteCode) return sendMSG.sendError(message.channel,"You already have set a invite code!");
        if(!args[0]) return sendMSG.sendError(message.channel,`Incorrect usage, please type \`${prefix}help setcode\` for the usage!`);
        if(!client.users.get(args[0])) return sendMSG.sendError(message.channel,"That's not a valid code!");
        userSchema.findOne({user: args[0]}, function (err, userData) {
            if(!userData){
                userData = {};
                userData.user = message.author.id;
            }
            if(!userData.guilds){
                userData.guilds = [];
            }
            userData.guilds.push(message.guild.id);
            saveUser(userData, message)
            guildData.inviteCode = args[0];
            save(guildData, message);
            message.channel.send(`Succesfully set that <@${args[0]}> has invited the bot!`);
            succeeded(id);
        })
    })
};
exports.help = {
    name: "setcode",
    category: "Moderation",
    description: "Set the user who invited you.",
    usage: "setcode <code>"
  };