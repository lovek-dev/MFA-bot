import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} from "discord.js";
import config from "../../config.json" with { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create welcome panel with rules and role buttons"),

  run: async (client, interaction) => {
    const isOwner = interaction.user.id === config.ownerId;
    const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
    const hasAllowedRole = config.allowedRoleId && 
                           config.allowedRoleId !== "ROLE_ALLOWED" && 
                           interaction.member.roles.cache.has(config.allowedRoleId);

    if (!isOwner && !isAdmin && !hasAllowedRole) {
      return interaction.reply({ content: "❌ You need Administrator permissions to use this command.", ephemeral: true });
    }

    const welcomeEmbed = new EmbedBuilder()
      .setTitle("🎉 Welcome to THE BOYS 🎉")
      .setDescription(config.welcomeMessage)
      .setImage(config.welcomeImage)
      .setColor("#ff0000");

    const rulesButton = new ButtonBuilder()
      .setCustomId("show_rules")
      .setLabel("📘 View Rules")
      .setStyle(ButtonStyle.Primary);

    const claimRolesButton = new ButtonBuilder()
      .setCustomId("claim_roles")
      .setLabel("🧩 Claim Roles")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(
      rulesButton,
      claimRolesButton
    );

    await interaction.reply({
      content: "Setup complete. Welcome panel created!",
      ephemeral: true
    });

    await interaction.channel.send({
      embeds: [welcomeEmbed],
      components: [row]
    });
  }
};
