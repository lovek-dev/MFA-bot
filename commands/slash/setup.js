import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";

import config from "../../config.json" assert { type: "json" };
import { hasBotAccess } from "../../utils/permissions.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup welcome + rules + claim roles panel"),

    run: async (client, interaction) => {

        if (!hasBotAccess(interaction.member))
            return interaction.reply({ content: "❌ You are not allowed to use this command.", ephemeral: true });

        // Welcome Embed
        const embed = new EmbedBuilder()
            .setTitle("👋 Welcome!")
            .setDescription(config.welcomeMessage)
            .setColor("Blue");

        // Buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("show_rules")
                .setLabel("📜 Rules")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("accept_rules")
                .setLabel("✅ Accept Rules")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("claim_roles")
                .setLabel("🎁 Claim Roles")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ content: "Setup complete!", ephemeral: true });

        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
};
