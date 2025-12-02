const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setrole")
    .setDescription("Set allowed role")
    .addRoleOption(o => o.setName("role").setDescription("Role").setRequired(true)),

  async run(client, interaction) {
    const role = interaction.options.getRole("role");
    config.allowedRole = role.id;

    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
    interaction.reply(`Allowed role set to ${role.name}`);
  }
};
