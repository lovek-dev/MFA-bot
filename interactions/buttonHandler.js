import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";
import config from "../config.json" assert { type: "json" };

export async function handleButton(interaction) {

    // 📜 Show Rules
    if (interaction.customId === "show_rules") {
        const rulesEmbed = new EmbedBuilder()
            .setTitle("📜 Server Rules")
            .setDescription(config.rulesText)
            .setColor("Yellow");

        return interaction.reply({ embeds: [rulesEmbed], ephemeral: true });
    }

    // ✅ Accept Rules
    if (interaction.customId === "accept_rules") {
        const role = interaction.guild.roles.cache.get(config.acceptRulesRoleId);
        if (!role)
            return interaction.reply({ content: "❌ Rules role not found!", ephemeral: true });

        await interaction.member.roles.add(role);
        return interaction.reply({ content: `✅ You now have the **${role.name}** role!`, ephemeral: true });
    }

    // 🎁 Claim Roles Panel
    if (interaction.customId === "claim_roles") {

        const claimEmbed = new EmbedBuilder()
            .setTitle("🎁 Claim Your Roles")
            .setDescription("Click a button below to toggle a role.")
            .setColor("Green");

        const rows = [];
        let row = new ActionRowBuilder();

        config.claimRoles.forEach((role, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`claim_${role.id}`)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Secondary)
            );

            if ((index + 1) % 3 === 0) {
                rows.push(row);
                row = new ActionRowBuilder();
            }
        });

        if (row.components.length > 0) rows.push(row);

        return interaction.reply({
            embeds: [claimEmbed],
            components: rows,
            ephemeral: true
        });
    }

    // 🎁 Claim Roles Buttons
    if (interaction.customId.startsWith("claim_")) {

        const roleId = interaction.customId.replace("claim_", "");
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role)
            return interaction.reply({ content: "❌ Role not found!", ephemeral: true });

        if (interaction.member.roles.cache.has(roleId)) {
            await interaction.member.roles.remove(roleId);
            return interaction.reply({ content: `❌ Removed **${role.name}** role.`, ephemeral: true });
        } else {
            await interaction.member.roles.add(roleId);
            return interaction.reply({ content: `✅ Added **${role.name}** role!`, ephemeral: true });
        }
    }
}
