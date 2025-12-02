const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();

// Load handlers
require("./handlers/commandHandler")(client);
require("./handlers/slashHandler")(client);

// Load events
const eventFiles = fs.readdirSync("./events");
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.run(client, ...args));
}

client.login(config.token);


