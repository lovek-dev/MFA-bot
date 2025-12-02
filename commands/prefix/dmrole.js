import { hasBotAccess } from "../../utils/permissions.js";

export default {
    name: "dmrole",
    run: async (client, message, args) => {

        if (!hasBotAccess(message.member))
            return message.reply("❌ You are not allowed to use this bot.");

        const role = message.mentions.roles.first();
        if (!role) return message.reply("Mention a role.");

        message.reply(`Sending DMs to ${role.members.size} users...`);

        let sent = 0;

        for (const member of role.members.values()) {
            try {
                await member.send(args.slice(1).join(" "));
                sent++;
                await new Promise(r => setTimeout(r, 1000));
            } catch {}
        }

        message.reply(`Finished. Sent ${sent} DMs.`);
    }
};
