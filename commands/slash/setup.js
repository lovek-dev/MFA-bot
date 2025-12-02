const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create welcome message with rules & claim roles buttons"),

  async run(client, interaction) {
    const welcomeEmbed = new EmbedBuilder()
      .setTitle("Welcome!")
      .setDescription(config.welcomeMessage)
      .setColor("Blue");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("show_rules")
        .setLabel("📘 View Rules")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("accept_rules")
        .setLabel("✅ Accept Rules")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("claim_roles")
        .setLabel("🎉 Claim Roles")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [welcomeEmbed],
      components: [row]
    });
  }
};
