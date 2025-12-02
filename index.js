import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Alive Server running on port ${PORT}`);
});

import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import fs from "fs";
import { logAction } from "./utils/logger.js";
import config from "./config.json" with { type: "json" };
import { handleButton } from "./interactions/buttonHandler.js";

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error("❌ DISCORD_BOT_TOKEN environment variable is not set!");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.prefixCommands = new Collection();

// Load prefix commands
for (const file of fs.readdirSync("./commands/prefix").filter(f => f.endsWith(".js"))) {
  const cmd = (await import(`./commands/prefix/${file}`)).default;
  client.prefixCommands.set(cmd.name, cmd);
}

// Load slash commands
client.slash = [];
for (const file of fs.readdirSync("./commands/slash").filter(f => f.endsWith(".js"))) {
  const cmd = (await import(`./commands/slash/${file}`)).default;
  client.commands.set(cmd.data.name, cmd);
  client.slash.push(cmd.data.toJSON());
}

// Ready event
client.once("ready", () => console.log(`✅ Logged in as ${client.user.tag}`));

// Prefix message handler
client.on("messageCreate", async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const cmd = client.prefixCommands.get(cmdName);
  if (!cmd) return;

  try {
    await cmd.run(client, message, args);
  } catch (e) {
    console.error(e);
    message.reply("❌ Error executing command.");
  }
});

// Slash commands & Button handler
client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (cmd) await cmd.run(client, interaction);
    }
    if (interaction.isButton()) await handleButton(interaction);
  } catch (e) {
    console.error(e);
    if (interaction.isRepliable())
      interaction.reply({ content: "❌ Command error.", ephemeral: true });
  }
});

// Login
client.login(token);
