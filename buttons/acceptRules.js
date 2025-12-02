import config from "../config.json" assert { type: "json" };

export default {
  customId: "accept_rules",

  run: async (client, interaction) => {
    const role = interaction.guild.roles.cache.get(config.verifyRoleId);

    if (!role) {
      return interaction.reply({ content: "❌ Verify role not found.", ephemeral: true });
    }

    await interaction.member.roles.add(role);
    interaction.reply({ content: "✅ You have accepted the rules!", ephemeral: true });
  }
};
