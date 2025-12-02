import config from "../config.json" assert { type: "json" };

export async function logAction(guild, embed) {
    const channel = guild.channels.cache.get(config.logChannelId);
    if (!channel) return;
    channel.send({ embeds: [embed] });
}
