const config = require("../config.json");

module.exports = {
  customId: "claim_roles",
  async run(client, interaction) {
    for (const role of config.claimRoles) {
      await interaction.member.roles.add(role.id).catch(() => {});
    }

    interaction.reply({ content: "🎉 Roles claimed!", ephemeral: true });
  }
};
