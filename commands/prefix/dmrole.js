module.exports = {
  name: "dmrole",
  async run(client, message, args) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Mention a role.");

    role.members.forEach(async member => {
      try {
        await member.send("Hello from DM role command!");
      } catch {}
    });

    message.reply("📨 DMs sent.");
  }
};
