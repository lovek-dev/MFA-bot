import { REST, Routes } from "discord.js";
import fs from "fs";
import config from "./config.json" assert { type: "json" };

const commands = [];

fs.readdirSync("./commands/slash/")
    .filter(file => file.endsWith(".js"))
    .forEach(async file => {
        const cmd = await import(`./commands/slash/${file}`);
        commands.push(cmd.default.data);
    });

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    try {
        console.log("Registering slash commands...");
        await rest.put(
            Routes.applicationCommands("YOUR_BOT_APPLICATION_ID"),
            { body: commands }
        );
        console.log("Slash commands registered.");
    } catch (e) {
        console.error(e);
    }
})();
