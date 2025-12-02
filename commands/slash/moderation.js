import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } from "discord.js";
import { logAction } from "../../utils/logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member")
        .addUserOption(o => o.setName("user").setDescription("User to kick").setRequired(true)),

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return interaction.reply({ content: "❌ No permission.", ephemeral: true });

        const user = interaction.options.getMember("user");

        await user.kick();

        const embed = new EmbedBuilder()
            .setTitle("User Kicked")
            .setDescription(`${user} kicked by ${interaction.user}`)
            .setColor("Red");

        logAction(interaction.guild, embed);

        interaction.reply("User kicked.");
    }
};
