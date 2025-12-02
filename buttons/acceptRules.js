const config = require("../config.json");

module.exports = {
  customId: "accept_rules",
  async run(client, interaction) {
    await interaction.member.roles.add(config.rulesAcceptRole);
    interaction.reply({ content: "✅ You accepted the rules!", ephemeral: true });
  }
};
