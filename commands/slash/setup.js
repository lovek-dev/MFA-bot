import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import config from "../../config.json" with { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create welcome panel with rules and role buttons"),

  run: async (client, interaction) => {

    if (!interaction.member.roles.cache.has(config.allowedRoleId)) {
      return interaction.reply({ content: "❌ You are not allowed to use this command.", ephemeral: true });
    }

    const welcomeEmbed = new EmbedBuilder()
      .setTitle("🎉 Welcome to THE BOYS 🎉")
      .setDescription(config.welcomeMessage)
      .setImage(config.welcomeImage)
      .setColor("#ff0000");

    const rulesButton = new ButtonBuilder()
      .setCustomId("show_rules")
      .setLabel("📘 View Rules")
      .setStyle(ButtonStyle.Primary);

    const acceptButton = new ButtonBuilder()
      .setCustomId("accept_rules")
      .setLabel("✅ Accept Rules")
      .setStyle(ButtonStyle.Success);

    const claimRolesButton = new ButtonBuilder()
      .setCustomId("claim_roles")
      .setLabel("🧩 Claim Roles")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(
      rulesButton,
      acceptButton,
      claimRolesButton
    );

    await interaction.reply({
      content: "Setup complete. Welcome panel created!",
      ephemeral: true
    });

    await interaction.channel.send({
      embeds: [welcomeEmbed],
      components: [row]
    });
  }
};
