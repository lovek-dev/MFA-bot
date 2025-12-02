import fs from "fs";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import config from "./config.json" assert { type: "json" };
import { logAction } from "./utils/logger.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();
client.prefixCommands = new Collection();

// Load prefix commands
fs.readdirSync("./commands/prefix/")
  .filter(f => f.endsWith(".js"))
  .forEach(file => {
      import(`./commands/prefix/${file}`).then(cmd => {
          client.prefixCommands.set(cmd.default.name, cmd.default);
      });
  });

// Load slash commands
client.slash = [];
fs.readdirSync("./commands/slash/")
  .filter(f => f.endsWith(".js"))
  .forEach(file => {
      import(`./commands/slash/${file}`).then(cmd => {
          client.slash.push(cmd.default.data);
          client.commands.set(cmd.default.data.name, cmd.default);
      });
  });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Prefix command handler
client.on("messageCreate", async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.prefixCommands.get(cmdName);
    if (!cmd) return;

    try {
        await cmd.run(client, message, args);
    } catch (e) {
        message.reply("❌ Error executing command.");
        console.error(e);
    }
});

// Slash command handler
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    try {
        await cmd.run(client, interaction);
    } catch (e) {
        interaction.reply({ content: "❌ Error executing slash command.", ephemeral: true });
        console.error(e);
    }
});

client.login(config.token);
