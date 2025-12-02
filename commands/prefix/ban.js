import { PermissionsBitField } from "discord.js";

export default {
  name: "ban",
  async run(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ You lack permissions.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention someone to ban.");

    await member.ban({ reason: args.slice(1).join(" ") || "No reason" });
    message.reply(`✅ Banned ${member.user.tag}`);
  }
};
