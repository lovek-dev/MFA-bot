export default {
    name: "dmrole",
    run: async (client, message, args) => {
        const role = message.mentions.roles.first();
        if (!role) return message.reply("Mention a role.");

        let sent = 0;

        message.reply(`Sending DMs to ${role.members.size} users...`);

        for (const member of role.members.values()) {
            try {
                await member.send(`Message from ${message.author}: ${args.slice(1).join(" ")}`);
                sent++;
                await new Promise(r => setTimeout(r, 1000));
            } catch {}
        }

        message.reply(`Finished. Sent ${sent} DMs.`);
    }
};
