const config = require("../config.json");

module.exports = {
  name: "interactionCreate",
  async run(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return;

      if (!interaction.member.roles.cache.has(config.allowedRole))
        return interaction.reply({ content: "❌ You don't have permission.", ephemeral: true });

      return cmd.run(client, interaction);
    }

    if (interaction.isButton()) {
      const btn = client.buttons.get(interaction.customId);
      if (btn) return btn.run(client, interaction);
    }
  }
};
