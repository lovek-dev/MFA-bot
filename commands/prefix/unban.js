module.exports = {
  name: "unban",
  async run(client, message, args) {
    const id = args[0];
    if (!id) return message.reply("Provide user ID.");

    await message.guild.members.unban(id);
    message.reply(`✅ Unbanned ${id}`);
  }
};
