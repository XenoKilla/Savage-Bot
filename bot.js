var Discord = require("discord.js");
var prefix = ".";
var client = new Discord.Client();

client.on("ready", () => {
  console.log("ready to rumble!");
});

client.on("message", msg => {

  if (msg.author.bot) return;
  if (!msg.member.hasPermission("ADMINISTRATOR")) return;

  if (msg.content.toLowerCase().startsWith(prefix + "kick ")) {
    var mem = msg.mentions.members.first();
    mem.kick().then(() => {
      msg.channel.send(mem.displayName + " has successfully been kicked by " + msg.author.username + "!");
    }).catch(e => {
      msg.channel.send("An error occured!");
    });
  }
  if (msg.content.toLowerCase().startsWith(prefix + "ban ")) {
    var mem = msg.mentions.members.first();
    var mc = msg.content.split(" ")[2];
    mem.ban(mc).then(() => {
      msg.channel.send(mem.displayName + " has successfully been banned by " + msg.author.username + " for " + mc + " days!");
    }).catch(e => {
      msg.channel.send("An error occured!");
    });
  }
  if (msg.content.toLowerCase().startsWith(prefix + "mute")) {
    var mem = msg.mentions.members.first();
    if (msg.guild.roles.find("name", "Muted")) {
      mem.addRole(msg.guild.roles.find("name", "Muted")).then(() => {
        msg.channel.send(mem.displayName + " has successfully been muted!");
      }).catch(e => {
        msg.channel.send("An error occured!");
        console.log(e);
      });

    }
  }
  if (msg.content.toLowerCase().startsWith(prefix + "unmute")) {
    var mem = msg.mentions.members.first();
    if (msg.guild.roles.find("name", "Muted")) {
      mem.removeRole(msg.guild.roles.find("name", "Muted")).then(() => {
        msg.channel.send(mem.displayName + " has successfully been unmuted!");
      }).catch(e => {
        msg.channel.send("An error occured!");
        console.log(e);
      });

    }
  }
  if (msg.content.toLowerCase().startsWith(prefix + "purge")) {
    var mc = msg.content.split(" ")[1];
    msg.channel.bulkDelete(mc);
  }
  if (msg.content.toLowerCase().startsWith(prefix + "eval")) {
    var sc = msg.content.substring(msg.content.indexOf(" "));
    eval(sc);
  }
  if (msg.content.toLowerCase().startsWith(prefix + "calc")) {
    var ca = msg.content.substring(msg.content.indexOf(" "));
    msg.reply(ca + " is " + eval(ca).toFixed(2));
  }
});


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

var prefix = ".";
var token = "NTc4MzQ1NDcwMTQxNzkyMjc3.XNyQPA.A4zdHm4T3WxsIn1nYY6iz-mWGaU";

client.on("ready", () => {
console.log("Xeno Bot | Logged in! Server count: ${client.guilds.size}");
client.user.setGame(`[.] Xeno Help`);
});

client.on("guildCreate", (guild) => {
client.user.setGame(`[.] Xeno Help`);
  guild.owner.user.send(`Hello! I'm the Xeno Bot!\nThanks for adding me to your guild!\n\nView all of my commands with \`vhelp\`.\nLearn more about me with \`vabout\`.\n\n**About:**Vulnix is a simple Discord support ticket bot that aims to provide easy to use mod and support functions for all servers!\n\n\Enjoy! ~Vulnix Teamn\*Need help? Wanna chill?*  Join the Vulnix Discord! https://discord.gg/HqNPFTC`);
});

client.on("message", (message) => {
if (!message.content.startsWith(prefix) || message.author.bot) return;

if (message.content.toLowerCase().startsWith(prefix + `help`)) {
  const embed = new Discord.RichEmbed()
  .setTitle(`:mailbox_with_mail: Xeno Help`)
  .setColor(0xCF40FA)
  .setDescription(`Hello! I'm the Xeno Bot, the Discord bot for super cool support ticket stuff and more! Here are my commands:`)
  .addField(`Tickets`, `[${prefix}new]() > Opens up a new ticket and tags the Support Team\n[${prefix}close]() > Closes a ticket that has been resolved or been opened by accident`)
  .addField(`Other`, `[${prefix}help]() > Shows you this help menu your reading\n[${prefix}ping]() > Pings the bot to see how long it takes to react\n[${prefix}about]() > Tells you all about Xeno bot`)
  message.channel.send({ embed: embed });
}

if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
  message.channel.send(`Hold on!`).then(m => {
  m.edit(`:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` + (m.createdTimestamp - message.createdTimestamp) + `ms, Discord API heartbeat is ` + Math.round(client.ping) + `ms.`);
  });
}

if (message.content.toLowerCase().startsWith(prefix + `new`)) {
  const reason = message.content.split(" ").slice(1).join(" ");
  if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
  if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`You already have a ticket open.`);
  message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
      let role = message.guild.roles.find("name", "Support Team");
      let role2 = message.guild.roles.find("name", "@everyone");
      c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
      });
      c.overwritePermissions(message.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      message.channel.send(`:white_check_mark: Your ticket has been created, #${c.name}.`);
      const embed = new Discord.RichEmbed()
      .setColor(0xCF40FA)
      .addField(`Hey ${message.author.username}!`, `Please try explain why you opened this ticket with as much detail as possible. Our **Support Team** will be here soon to help.`)
      .setTimestamp();
      c.send({ embed: embed });
  }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `close`)) {
  if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);

  message.channel.send(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`-confirm\`. This will time out in 10 seconds and be cancelled.`)
  .then((m) => {
    message.channel.awaitMessages(response => response.content === '-confirm', {
      max: 1,
      time: 10000,
      errors: ['time'],
    })
    .then((collected) => {
        message.channel.delete();
      })
      .catch(() => {
        m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
            m2.delete();
        }, 3000);
      });
  });
}

});

client.login('NTc4MzQ1NDcwMTQxNzkyMjc3.XNyQPA.A4zdHm4T3WxsIn1nYY6iz-mWGaU');
