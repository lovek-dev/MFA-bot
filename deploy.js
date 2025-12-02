import { REST, Routes } from "discord.js";
import fs from "fs";
import config from "./config.json" assert { type: "json" };

const commands = [];
for (const file of fs.readdirSync("./commands/slash").filter(f => f.endsWith(".js"))) {
  const cmd = (await import(`./commands/slash/${file}`)).default;
  commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);
const appId = "YOUR_APPLICATION_ID";

try {
  console.log("Registering slash commands...");
  await rest.put(Routes.applicationCommands(appId), { body: commands });
  console.log("✅ Slash commands registered.");
} catch (e) {
  console.error(e);
}

