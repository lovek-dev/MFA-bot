import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("Send a message")
        .addStringOption(o => o.setName("title").setDescription("Embed title"))
        .addStringOption(o => o.setName("description").setDescription("Embed text"))
        .addStringOption(o => o.setName("text").setDescription("Normal text")),

    run: async (client, interaction) => {
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
