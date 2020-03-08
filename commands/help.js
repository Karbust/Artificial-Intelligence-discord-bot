const sendMSG = require('../functions-msg.js');
const discord = require("discord.js");
const { succeeded } = require('../functions');
const config = require("../config.json");
module.exports.run = async (prefix, client, message, args, id) => {
  if (!args[0]) {
    if(!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return sendMSG.sendError(message.channel,"It seems like I'm missing `ADD REACTIONS` permission! PLease give me this permission.");
    if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return sendMSG.sendError(message.channel,"It seems like I'm missing `EMBED LINKS` permission! PLease give me this permission.");
    let moderationArr = [],
      informationArr = [],
      funArr = [],
      ccArr = [],
      timersArr = [],
      welcomeArr = [],
      roleArr = [],
      ecoArr = [];
    client.cmdhelp.filter(cmd => cmd.category === "Moderation").forEach(cmd => {moderationArr.push(cmd.name)});
    client.cmdhelp.filter(cmd => cmd.category === "Information").forEach(cmd => {informationArr.push(cmd.name)});
    client.cmdhelp.filter(cmd => cmd.category === "Fun").forEach(cmd => {funArr.push(cmd.name)});
    client.cmdhelp.filter(cmd => cmd.category === "Custom commands").forEach(cmd => {ccArr.push(cmd.name)});
    client.cmdhelp.filter(cmd => cmd.category === "Timers").forEach(cmd => {timersArr.push(cmd.name)});
    client.cmdhelp.filter(cmd => cmd.category === "Welcome commands").forEach(cmd => {welcomeArr.push(cmd.name)});
    client.cmdhelp.filter(cmd => cmd.category === "Roles").forEach(cmd => {roleArr.push(cmd.name)});
    client.cmdhelp.filter(cmd => cmd.category === "Economy").forEach(cmd => {ecoArr.push(cmd.name)});
    const pages = {
      1: { title: "Custom commands", description: ccArr.join("\n") },
      2: { title: "Timer commands", description: timersArr.join("\n") },
      3: { title: "Welcome commands", description: welcomeArr.join("\n") },
      4: { title: "Role commands", description: roleArr.join("\n") },
      5: { title: "Information commands", description: informationArr.join("\n") },
      6: { title: "Fun commands", description: funArr.join("\n") },
      7: { title: "Moderation commands", description: moderationArr.join("\n") },
      8: { title: "Economy commands", description: ecoArr.join("\n") },
      9: { title: "Shortcuts", description: config.shortcuts.join("\n") }
    };
    let page = 0;
    let min = 0;
    let max = 9;
    let ccpage = 1;
    let timerpage = 2;
    let welcomepage = 3;
    let infopage = 5;
    let funpage = 6;
    let modpage = 7;
    let ecopage = 8;
    let shortcutpage = 9;
    const starterembed = new discord.MessageEmbed()
    sendMSG.sendEmbed(message.channel, "help", "▶ = next page\n◀ = page back\n🏠 = home\n📝 = custom commands (cc)\n⌛ = timer commands\n🤗 = welcome commands\nℹ️ = information commands\n😂 = fun\n🔨 = moderation commands\n💰 = economy commands\n✂ = shortcuts", [], [], false).then(m => {
      ["◀","▶","🏠","📝","⌛","🤗","ℹ️","😂","🔨","💰","✂"].map(emoji => m.react(emoji));
      const collector = m.createReactionCollector((reaction, user) => user !== client.user && user.id == message.author.id);
      collector.on("end", collected => console.log(collected));
      collector.on("collect", async reaction => {
        succeeded(id);
        const chosen = reaction.emoji.name;
        let embed = new discord.MessageEmbed()
        .setColor(config.default.embed.color)
        .setFooter(config.footer);
        if (chosen === "◀") {
          if (page != min) {
            page = Math.round(page - 1);
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        } else if (chosen === "▶") {
          if (page != max) {
            page = Math.round(page + 1);
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        } else if (chosen === "🏠") {
          page = 0;
          return m.edit(starterembed);
        } else if (chosen === "📝") {
          if (page != ccpage) {
            page = ccpage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        }else if (chosen === "⌛") {
          if (page != timerpage) {
            page = timerpage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        } else if (chosen === "🤗") {
          if (page != welcomepage) {
            page = welcomepage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        }else if (chosen === "ℹ️") {
          if (page != infopage) {
            page = infopage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        } else if (chosen === "😂") {
          if (page != funpage) {
            page = funpage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        } else if (chosen === "🔨") {
          if (page != modpage) {
            page = modpage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        } else if (chosen === "💰") {
          if (page != ecopage) {
            page = ecopage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        }else if (chosen === "✂") {
          if (page != shortcutpage) {
            page = shortcutpage;
            embed.setTitle(pages[page].title);
            embed.setDescription(pages[page].description);
            return m.edit(embed);
          }
        } else {
          collector.stop();
        }
        const notbot = reaction.users.filter(user => user !== client.user).first();
        if(!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return
        await reaction.users.remove(notbot);
      });
      setTimeout(() => {
        if(!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return m.edit("Help stopped!");
        m.delete();
        message.delete();
      }, 60000);
    });
  } else {
    let cmd = client.cmdhelp.filter(cmd => cmd.name === args[0]).first();
    let fields = [];
    if (args[0] == "usage") {
      for (let i = 0; i < config.usage.length; i++) {
        fields.push({name:config.usage[i].name,value:config.usage[i].description});
      }
      sendMSG.sendEmbed(message.channel, "Usage", "", fields, [], false);
      return succeeded(id);
    } else if (args[0] == "video") {
      for (let i = 0; i < config.videos.length; i++) {
        fields.push({name: config.videos[i].name,value:config.videos[i].video});
      }
      sendMSG.sendEmbed(message.channel, "Videos", "", fields, [], false);
      return succeeded(id);
    }
    if (!cmd) {
      return sendMSG.sendError(message.channel, "No command found");
    }
    embed
    sendMSG.sendEmbed(message.channel, cmd.name.charAt(0).toUpperCase() + cmd.name.substr(1), cmd.description, [{name:"Usage",value:"```" + cmd.usage + "```"},{name:"\u200b",value:"Use `help usage` to see all the usage parameters (<parameter>)."}], [], false);
    succeeded(id);
  }
};

exports.help = {
  name: "help",
  category: "General",
  description: "Displays all the commands, or specify a command for details.",
  usage: "help [commandName]"
};
