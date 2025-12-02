const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption(o => o.setName("user").setDescription("User").setRequired(true))
    .addIntegerOption(o => o.setName("ms").setDescription("Milliseconds").setRequired(true)),

  async run(client, interaction) {
    const user = interaction.options.getMember("user");
    const ms = interaction.options.getInteger("ms");

    await user.timeout(ms);
    interaction.reply(`Timed out ${user.user.tag}`);
  }
};
