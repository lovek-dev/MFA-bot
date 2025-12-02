import { SlashCommandBuilder } from "discord.js";
import { hasBotAccess } from "../../utils/permissions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("dmrole")
    .setDescription("DM all members of a role")
    .addRoleOption(o => o.setName("role").setDescription("Role").setRequired(true))
    .addStringOption(o => o.setName("message").setDescription("Message").setRequired(true)),

  async run(client, interaction) {
    if (!hasBotAccess(interaction.member))
      return interaction.reply({ content: "❌ Not allowed.", ephemeral: true });

    const role = interaction.options.getRole("role");
    const msg = interaction.options.getString("message");

    let sent = 0;
    for (const member of role.members.values()) {
      try {
        await member.send(msg);
        sent++;
        await new Promise(r => setTimeout(r, 1000));
      } catch {}
    }

    interaction.reply(`✅ DMed ${sent}/${role.members.size} members.`);
  }
};
