import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { hasBotAccess } from "../../utils/permissions.js";

export default {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("Send a message or embed")
        .addStringOption(o => o.setName("title").setDescription("Embed title"))
        .addStringOption(o => o.setName("description").setDescription("Embed description"))
        .addStringOption(o => o.setName("text").setDescription("Normal text message")),

    run: async (client, interaction) => {

        if (!hasBotAccess(interaction.member))
            return interaction.reply({ content: "❌ You are not allowed to use this bot.", ephemeral: true });

        const title = interaction.options.getString("title");
        const desc = interaction.options.getString("description");
        const text = interaction.options.getString("text");

        if (text) return interaction.reply(text);

        const embed = new EmbedBuilder().setColor("Blue");
        if (title) embed.setTitle(title);
        if (desc) embed.setDescription(desc);

        interaction.reply({ embeds: [embed] });
    }
};

