import { EmbedBuilder } from "discord.js";
import config from "../config.json" with { type: "json" };

export default {
  customId: "show_rules",

  run: async (client, interaction) => {
    const rulesEmbed = new EmbedBuilder()
      .setTitle("📘 Clan Rules")
      .setDescription(config.rulesMessage)
      .setColor("#0099ff");

    interaction.reply({
      embeds: [rulesEmbed],
      ephemeral: true
    });
  }
};
