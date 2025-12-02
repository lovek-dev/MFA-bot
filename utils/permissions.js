export function checkPerm(member, perm) {
    return member.permissions.has(perm);
}

export function botPermCheck(interaction, perm) {
    return interaction.guild.members.me.permissions.has(perm);
}
import config from "../config.json" assert { type: "json" };

export function hasBotAccess(member) {
    return member.roles.cache.has(config.allowedRoleId);
}
