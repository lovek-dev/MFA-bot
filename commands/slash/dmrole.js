import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("dmrole")
        .setDescription("DM all members in a role")
        .addRoleOption(o => o.setName("role").setDescription("Role").setRequired(true))
        .addStringOption(o => o.setName("message").setDescription("Message").setRequired(true)),

    run: async (client, interaction) => {
        const role = interaction.options.getRole("role");
        const msg = interaction.options.getString("message");

        interaction.reply(`Sending DMs to ${role.members.size} users...`);

        let sent = 0;

        for (const member of role.members.values()) {
            try {
                await member.send(msg);
                sent++;
                await new Promise(r => setTimeout(r, 1000));
            } catch {}
        }

        interaction.followUp(`Finished. Sent ${sent} DMs.`);
    }
};
