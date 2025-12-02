const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user")
    .addUserOption(o => o.setName("user").setDescription("User").setRequired(true)),

  async run(client, interaction) {
    const user = interaction.options.getMember("user");
    await user.kick();
    interaction.reply(`Kicked ${user.user.tag}`);
  }
};
