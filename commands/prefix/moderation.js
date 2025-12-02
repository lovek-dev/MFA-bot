import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { hasBotAccess } from "../../utils/permissions.js";
import { logAction } from "../../utils/logger.js";

export default {
    name: "kick",
    run: async (client, message, args) => {

        // Bot access check
        if (!hasBotAccess(message.member))
            return message.reply("❌ You are not allowed to use this bot.");

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("❌ You don't have permission to kick.");

        const user = message.mentions.members.first();
        if (!user) return message.reply("Mention someone to kick.");

        await user.kick();

        const embed = new EmbedBuilder()
            .setTitle("User Kicked")
            .setDescription(`${user} was kicked by ${message.author}`)
            .setColor("Red");

        logAction(message.guild, embed);
        message.reply("User kicked.");
    }
};
