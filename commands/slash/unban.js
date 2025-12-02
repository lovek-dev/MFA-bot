const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban user ID")
    .addStringOption(o => o.setName("id").setDescription("User ID").setRequired(true)),

  async run(client, interaction) {
    await interaction.guild.members.unban(interaction.options.getString("id"));
    interaction.reply("User unbanned.");
  }
};
