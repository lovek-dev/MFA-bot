import { REST, Routes } from "discord.js";
import fs from "fs";

const token = process.env.DISCORD_BOT_TOKEN;
const appId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.DISCORD_GUILD_ID;

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
  console.log(`Found ${commands.length} slash commands to register...`);
  
  if (guildId) {
    // Guild-specific commands (instant update)
    console.log(`Registering commands to guild ${guildId}...`);
    await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands });
    console.log("✅ Guild slash commands registered (instant).");
  } else {
    // Global commands (takes up to 1 hour)
    console.log("Registering global commands...");
    await rest.put(Routes.applicationCommands(appId), { body: commands });
    console.log("✅ Global slash commands registered (may take up to 1 hour to appear).");
  }
  
  console.log("\nRegistered commands:");
  commands.forEach(cmd => console.log(`  - /${cmd.name}: ${cmd.description}`));
} catch (e) {
  console.error("Error registering commands:", e);
}
