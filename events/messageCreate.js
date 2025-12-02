const config = require("../config.json");

module.exports = {
  name: "messageCreate",
  async run(client, message) {
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commands.get(cmdName);
    if (!cmd) return;

    if (!message.member.roles.cache.has(config.allowedRole))
      return message.reply("❌ You don't have permission to use this bot.");

    cmd.run(client, message, args);
  }
};
