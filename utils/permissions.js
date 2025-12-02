import config from "../config.json" assert { type: "json" };
import fs from "fs";

// Check if user has allowed role OR is owner
export function hasBotAccess(member) {
    if (member.id === config.ownerId) return true; // owner bypass
    return member.roles.cache.has(config.allowedRoleId);
}

// Update allowed role inside config.json
export function updateAllowedRole(roleId) {
    config.allowedRoleId = roleId;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}

