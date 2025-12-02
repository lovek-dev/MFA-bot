import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("../config.json");

export async function handleButton(interaction) {
  const id = interaction.customId;

  if (id === "show_rules") {
    const embed = new EmbedBuilder()
      .setTitle("📜 Rules")
      .setDescription(config.rulesText)
      .setColor("Yellow");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (id === "accept_rules") {
    const role = interaction.guild.roles.cache.get(config.acceptRulesRoleId);
    if (!role) return interaction.reply({ content: "❌ Role missing.", ephemeral: true });
    await interaction.member.roles.add(role).catch(() => {});
    return interaction.reply({ content: `✅ You now have **${role.name}**!`, ephemeral: true });
  }

  if (id === "claim_roles") {
    const embed = new EmbedBuilder()
      .setTitle("🎁 Claim Roles")
      .setDescription("Click below to toggle a role.")
      .setColor("Green");

    const rows = [];
    let row = new ActionRowBuilder();
    config.claimRoles.forEach((r, i) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`claim_${r.id}`)
          .setLabel(r.label)
          .setStyle(ButtonStyle.Secondary)
      );

      if ((i + 1) % 3 === 0) {
        rows.push(row);
        row = new ActionRowBuilder();
      }
    });

    if (row.components.length > 0) rows.push(row);

    return interaction.reply({ embeds: [embed], components: rows, ephemeral: true });
  }

  if (id.startsWith("claim_")) {
    const roleId = id.replace("claim_", "");
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) return interaction.reply({ content: "❌ Role not found.", ephemeral: true });

    if (interaction.member.roles.cache.has(roleId)) {
      await interaction.member.roles.remove(roleId).catch(() => {});
      return interaction.reply({ content: `❌ Removed role **${role.name}**.`, ephemeral: true });
    } else {
      await interaction.member.roles.add(roleId).catch(() => {});
      return interaction.reply({ content: `✅ Added role **${role.name}**.`, ephemeral: true });
    }
  }
}
