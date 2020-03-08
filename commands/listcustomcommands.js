const sendMSG = require('../functions-msg.js');
const discord = require('discord.js');
const guildSchema = require('../mongodb/guild');
const { succeeded } = require('../functions');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
    if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return sendMSG.sendError(message.channel,"It seems like I'm missing `EMBED_LINKS` permission! PLease give me this permission.");
    guildSchema.findOne({guild:message.guild.id}).then(guildData => {
        const customCommands = guildData.cc
        let fields = [];
        if(customCommands && customCommands.length !== 0){
            for(let i=0;i<customCommands.length;i++){
                let command = customCommands[i].command;
                let response = customCommands[i].response;
               fields.push({name:`Command: \`${command}\``,value:`Response: \`${response}\``});
            }
            sendMSG.sendEmbed(message.channel,"Listcustomcommands","",fields,[],false);
            succeeded(id);
        } else {
            sendMSG.sendError(message.channel,"No custom commands found");
        }
    })
};
exports.help = {
    name: "listcustomcommands",
    category: "Custom commands",
    description: "List of all the custom commands.",
    usage: "listcustomcommands"
  };