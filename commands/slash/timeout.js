import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption(o => o.setName("user").setDescription("User").setRequired(true))
    .addIntegerOption(o => o.setName("ms").setDescription("Milliseconds").setRequired(true)),

  async run(client, interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: "❌ You lack permissions to timeout members.", ephemeral: true });
    }

    const user = interaction.options.getMember("user");
    const ms = interaction.options.getInteger("ms");

    if (!user) {
      return interaction.reply({ content: "❌ Could not find that member.", ephemeral: true });
    }

    try {
      await user.timeout(ms);
      interaction.reply(`⏳ Timed out ${user.user.tag}`);
    } catch (e) {
      interaction.reply({ content: "❌ Could not timeout that user.", ephemeral: true });
    }
  }
};
