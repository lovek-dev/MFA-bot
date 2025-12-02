const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
  customId: "show_rules",
  async run(client, interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📘 Server Rules")
      .setDescription(config.rulesText)
      .setColor("Blue");

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
