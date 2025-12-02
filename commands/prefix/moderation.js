import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { logAction } from "../../utils/logger.js";

export default {
    name: "kick",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("❌ You don't have permission.");

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
