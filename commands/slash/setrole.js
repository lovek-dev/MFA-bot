import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { updateAllowedRole } from "../../utils/permissions.js";
import config from "../../config.json" assert { type: "json" };

export default {
    data: new SlashCommandBuilder()
        .setName("setrole")
        .setDescription("Set which role can use the bot")
        .addRoleOption(o =>
            o.setName("role")
            .setDescription("Role that will be allowed")
            .setRequired(true)
        ),

    run: async (client, interaction) => {

        if (interaction.user.id !== config.ownerId)
            return interaction.reply({ content: "❌ Only the bot owner can use this.", ephemeral: true });

        const role = interaction.options.getRole("role");

        updateAllowedRole(role.id);

        interaction.reply(`✅ Bot access role updated to: **${role.name}**`);
    }
};
