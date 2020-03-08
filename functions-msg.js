const discord = require('discord.js');
const config = require('./config.json');
/**
 * @param {object} channel - The channel to send to
 * @param {string} title - The title(command name) to set
 * @param {string} description - The description to set
 * @param {array} fields - The fields to add
 * @param {array} files - The files to add
 * @param {boolean} error - Error or not
*/
const sendEmbed = function(channel, title, description, fields, files, error){
    if(typeof channel !== "object" || typeof title !== "string" || typeof description !== "string" || typeof fields !== "object" || typeof files !== "object" || typeof error !== "boolean"){
        return channel.send(`An error has appeared please report ${title} to my support server!`);
    };
    const embed = new discord.MessageEmbed().setTitle(title).setDescription(description);
    fields.forEach(field => embed.addField(field.name, field.value));
    embed.attachFiles(files).setFooter(config.footer);
    if(error){
        embed.setColor(config.default.embed.error.color);
        return channel.send(embed);
    }
    embed.setColor(config.default.embed.color);
    return channel.send(embed);
};
/**
 * @param {object} channel - The channel to send to
 * @param {string} message - The message to send
 */
const sendMessage = function(channel, message){
    if(typeof channel !== "object" || typeof message !== "string"){
        return channel.send(`An error has appeared please report this to my support server!`);
    };
    return channel.send(message);
};

/**
 * @param {object} channel - The channel to send to
 * @param {string} error - The error
 */
const sendError = function(channel, error){
    if(typeof channel !== "object" || typeof error !== "string"){
        return channel.send(`An error has appeared please report this to my support server!`);
    };
    return channel.send(`An error threw when using this command. Please report this in the support server!\`\`\`${error}\`\`\``);
};
/**
 * @param {object} guild - The guild to send to
 * @param {object} member - The member which is used
 * @param {object} moderator - The member which did it
 * @param {string} action - The action performed
 */
const sendLog = function(guild, member, moderator, reason, action){
    const embed = new discord.MessageEmbed().setTitle(action);
    if(action == "mute"){
        embed.setColor("#ffff00");
    } else if(action == "unmute"){
        embed.setColor("#00ff00");
    } else if(action == "kick"){
        embed.setColor("#ffff00");
    } else if(action == "ban"){
        embed.setColor("#ff0000");
    }
    embed.addField("User", `${member.user.tag}(${member})`);
    embed.addField("Moderator", `${moderator.displayName} | ${moderator.user.tag}`);
    embed.addField("Reason", reason);
    return guild.owner.send(embed).catch(() => {
        embed.setDescription("I couldn't dm the guild owner, so I'm sending it to you!");
        moderator.send(embed);
    });
};

module.exports = {sendEmbed,sendMessage,sendError,sendLog};