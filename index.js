import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Alive Server running on port ${PORT}`);
});

import { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } from "discord.js";
import fs from "fs";
import { logAction } from "./utils/logger.js";
import config from "./config.json" with { type: "json" };
import { handleButton } from "./interactions/buttonHandler.js";

function loadResponses() {
  try {
    const data = fs.readFileSync("./data/responses.json", "utf8");
    return JSON.parse(data);
  } catch {
    return { autoResponses: {} };
  }
}

function loadSchedules() {
  try {
    const data = fs.readFileSync("./data/schedules.json", "utf8");
    return JSON.parse(data);
  } catch {
    return { scheduledMessages: [] };
  }
}

function saveSchedules(data) {
  fs.writeFileSync("./data/schedules.json", JSON.stringify(data, null, 2));
}

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
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  
  setInterval(async () => {
    const data = loadSchedules();
    const now = new Date();
    const toSend = [];
    const remaining = [];

    for (const schedule of data.scheduledMessages) {
      const scheduledTime = new Date(schedule.scheduledTime);
      if (scheduledTime <= now) {
        toSend.push(schedule);
      } else {
        remaining.push(schedule);
      }
    }

    for (const schedule of toSend) {
      try {
        const channel = await client.channels.fetch(schedule.channelId);
        if (channel) {
          const embed = new EmbedBuilder()
            .setTitle(schedule.embed.title)
            .setDescription(schedule.embed.description)
            .setColor(schedule.embed.color)
            .setTimestamp();
          await channel.send({ embeds: [embed] });
          console.log(`📨 Sent scheduled message: ${schedule.embed.title}`);
        }
      } catch (e) {
        console.error(`Failed to send scheduled message ${schedule.id}:`, e.message);
      }
    }

    if (toSend.length > 0) {
      data.scheduledMessages = remaining;
      saveSchedules(data);
    }
  }, 30000);
});

// Prefix message handler & Auto-responder
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const responses = loadResponses();
  const messageContent = message.content.toLowerCase();
  
  for (const [trigger, info] of Object.entries(responses.autoResponses)) {
    if (messageContent.includes(trigger)) {
      try {
        await message.reply(info.reply);
      } catch (e) {
        console.error("Auto-response error:", e.message);
      }
      break;
    }
  }

  if (!message.content.startsWith(config.prefix)) return;

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
