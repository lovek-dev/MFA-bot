import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("../config.json");

export async function logAction(guild, embed) {
  const ch = guild.channels.cache.get(config.logChannelId);
  if (!ch) return;
  await ch.send({ embeds: [embed] }).catch(() => {});
}
