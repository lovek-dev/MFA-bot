import { SlashCommandBuilder } from "discord.js";
import { hasBotAccess } from "../../utils/permissions.js";

export default {
    data: new SlashCommandBuilder()
        .setName("dmrole")
        .setDescription("DM all members of a role")
        .addRoleOption(o =>
            o.setName("role").setDescription("Role").setRequired(true)
        )
        .addStringOption(o =>
            o.setName("message").setDescription("Message to send").setRequired(true)
        ),

    run: async (client, interaction) => {

        if (!hasBotAccess(interaction.member))
            return interaction.reply({ content: "❌ You are not allowed to use this bot.", ephemeral: true });

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
