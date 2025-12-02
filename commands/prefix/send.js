import { EmbedBuilder } from "discord.js";

export default {
    name: "send",
    run: async (client, message, args) => {
        const type = args.shift();
        if (type === "embed") {
            const title = args.shift();
            const desc = args.join(" ");

            const embed = new EmbedBuilder()
                .setTitle(title || "No Title")
                .setDescription(desc || "No Description")
                .setColor("Blue");

            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send(args.join(" "));
        }
    }
};
