const fs = require("fs");
const config = require("../../config.json");

module.exports = {
  name: "setrole",
  async run(client, message, args) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Mention a role.");

    config.allowedRole = role.id;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));

    message.reply(`✅ Allowed role set to: ${role.name}`);
  }
};
