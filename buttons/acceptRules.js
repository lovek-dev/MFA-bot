export default {
  customId: "claim_roles",

  run: async (client, interaction) => {
    interaction.reply({
      content: "🧩 Roles Menu Coming Soon (tell me which roles to add!)",
      ephemeral: true
    });
  }
};
