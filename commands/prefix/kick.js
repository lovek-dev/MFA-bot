import { PermissionsBitField } from "discord.js";

export default {
  name: "kick",
  async run(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("❌ You lack permissions.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention someone to kick!");

    await member.kick();
    message.reply(`✅ Kicked ${member.user.tag}`);
  }
};
