import {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} from "discord.js";
import { hasBotAccess } from "../../utils/permissions.js";
import config from "../../config.json" assert { type: "json" };

export default {
  data: new SlashCommandBuilder().setName("setup").setDescription("Setup welcome & rules panel"),

  async run(client, interaction) {
    if (!hasBotAccess(interaction.member))
      return interaction.reply({ content: "❌ Not allowed.", ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle("👋 Welcome!")
      .setDescription(config.welcomeMessage)
      .setColor("Blue");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("show_rules").setLabel("📜 Rules").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("accept_rules").setLabel("✅ Accept Rules").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("claim_roles").setLabel("🎁 Claim Roles").setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ content: "✅ Setup complete!", ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [row] });
  }
};
