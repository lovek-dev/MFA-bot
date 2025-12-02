import { REST, Routes } from "discord.js";
import fs from "fs";

const token = process.env.DISCORD_BOT_TOKEN;
const appId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  console.error("❌ DISCORD_BOT_TOKEN environment variable is not set!");
  process.exit(1);
}

if (!appId) {
  console.error("❌ DISCORD_APPLICATION_ID environment variable is not set!");
  process.exit(1);
}

const commands = [];
for (const file of fs.readdirSync("./commands/slash").filter(f => f.endsWith(".js"))) {
  const cmd = (await import(`./commands/slash/${file}`)).default;
  commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

try {
  console.log("Registering slash commands...");
  await rest.put(Routes.applicationCommands(appId), { body: commands });
  console.log("✅ Slash commands registered.");
} catch (e) {
  console.error(e);
}
