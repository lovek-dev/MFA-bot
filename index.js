import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import fs from "fs";
import { logAction } from "./utils/logger.js";
import config from "./config.json" assert { type: "json" };
import { handleButton } from "./interactions/buttonHandler.js";

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

client.once("ready", () => console.log(`✅ Logged in as ${client.user.tag}`));

// Prefix handler
client.on("messageCreate", async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const cmd = client.prefixCommands.get(cmdName);
  if (!cmd) return;

  try { await cmd.run(client, message, args); }
  catch (e) { console.error(e); message.reply("❌ Error e
