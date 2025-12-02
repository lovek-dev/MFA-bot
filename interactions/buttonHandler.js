import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import config from "../config.json" with { type: "json" };

export async function handleButton(interaction) {
  const id = interaction.customId;

  if (id === "show_rules") {
    const embed = new EmbedBuilder()
      .setTitle("📜 Rules")
      .setDescription(config.rulesMessage || "No rules configured.")
      .setImage("https://media.discordapp.net/attachments/1438611778433974313/1445456826597380116/image.png?ex=69306a12&is=692f1892&hm=2ce9df402e3f0e134216d5ecff21143128522107b982693bf85dc2273ba47ebd&=&format=webp&quality=lossless&width=848&height=163")
      .setColor("Yellow");

    const acceptButton = new ButtonBuilder()
      .setCustomId("accept_rules")
      .setLabel("✅ Accept Rules")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(acceptButton);

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  if (id === "accept_rules") {
    if (!config.verifyRoleId || config.verifyRoleId === "ROLE_TO_GIVE_ON_ACCEPT") {
      return interaction.reply({ 
        content: "❌ Verification role not configured. An admin needs to set verifyRoleId in config.json.", 
        ephemeral: true 
      });
    }

    const role = interaction.guild.roles.cache.get(config.verifyRoleId);
    if (!role) {
      return interaction.reply({ 
        content: "❌ Could not find the verification role. Please contact an admin.", 
        ephemeral: true 
      });
    }

    try {
      await interaction.member.roles.add(role);
      return interaction.reply({ content: `✅ You now have **${role.name}**!`, ephemeral: true });
    } catch (e) {
      return interaction.reply({ 
        content: "❌ Could not assign the role. The bot may lack permissions.", 
        ephemeral: true 
      });
    }
  }

  if (id === "claim_roles") {
    if (!config.claimRoles || config.claimRoles.length === 0) {
      return interaction.reply({ 
        content: "🧩 No claimable roles configured yet!", 
        ephemeral: true 
      });
    }

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

    try {
      if (interaction.member.roles.cache.has(roleId)) {
        await interaction.member.roles.remove(roleId);
        return interaction.reply({ content: `❌ Removed role **${role.name}**.`, ephemeral: true });
      } else {
        await interaction.member.roles.add(roleId);
        return interaction.reply({ content: `✅ Added role **${role.name}**.`, ephemeral: true });
      }
    } catch (e) {
      return interaction.reply({ 
        content: "❌ Could not modify your roles. The bot may lack permissions.", 
        ephemeral: true 
      });
    }
  }
}
