# MFA Discord Bot

## Overview
A feature-rich Discord moderation bot with prefix commands, slash commands, and interactive button handlers for server management.

## Project Structure
```
├── index.js                 # Main bot entry point
├── deploy.js                # Slash command registration script
├── config.json              # Bot configuration (non-sensitive settings)
├── commands/
│   ├── prefix/              # Prefix-based commands (+command)
│   │   ├── ban.js           # Ban a user
│   │   ├── kick.js          # Kick a user
│   │   ├── timeout.js       # Timeout a user
│   │   ├── unban.js         # Unban a user
│   │   ├── moderation.js    # Moderation command with logging
│   │   ├── dmrole.js        # DM all members of a role
│   │   ├── embed.js         # Send an embed message
│   │   ├── say.js           # Make bot say something
│   │   ├── send.js          # Send text or embed
│   │   └── setrole.js       # Set allowed role for bot commands
│   └── slash/               # Slash commands (/command)
│       ├── kick.js          # Kick a user
│       ├── timeout.js       # Timeout a user
│       ├── unban.js         # Unban a user
│       ├── moderation.js    # Moderation command with logging
│       ├── dmrole.js        # DM all members of a role
│       ├── send.js          # Send text or embed
│       ├── setrole.js       # Set allowed role for bot commands
│       └── setup.js         # Create welcome panel with rules
├── buttons/                 # Button interaction handlers
│   ├── acceptRules.js       # Accept rules button handler
│   ├── claimRole.js         # Claim roles button handler
│   └── showRules.js         # Show rules button handler
├── interactions/
│   └── buttonHandler.js     # Central button interaction router
├── utils/
│   ├── logger.js            # Action logging utility
│   └── permissions.js       # Permission checking utilities
└── handlers/
    ├── commandHandler.js    # Command loading handler
    └── slashHandler.js      # Slash command handler
```

## Environment Variables Required
- `DISCORD_BOT_TOKEN` - Your Discord bot token (required)
- `DISCORD_APPLICATION_ID` - Your Discord application ID (required for deploying slash commands)

## Configuration (config.json)
The `config.json` file contains non-sensitive configuration:
- `prefix`: Command prefix (default: `+`)
- `logChannelId`: Channel ID for logging actions
- `allowedRoleId`: Role ID that can use moderation commands
- `verifyRoleId`: Role given when users accept rules
- `ownerId`: Bot owner's Discord user ID
- `welcomeImage`: URL for welcome panel image
- `welcomeMessage`: Welcome panel message text
- `rulesMessage`: Server rules text
- `claimRoles`: Array of claimable roles `[{ "id": "roleId", "label": "Role Name" }]`

## Commands

### Prefix Commands (use with `+` prefix)
- `+ban @user [reason]` - Ban a user
- `+kick @user` - Kick a user
- `+timeout @user [ms]` - Timeout a user for specified milliseconds
- `+unban [userId]` - Unban a user by ID
- `+mod @user` - Kick with logging
- `+dmrole @role [message]` - DM all members of a role
- `+embed [title] [description]` - Send an embed
- `+say [message]` - Make the bot say something
- `+send [embed] [title] [description]` - Send text or embed
- `+setrole @role` - Set the allowed role for bot commands

### Slash Commands
- `/kick user:` - Kick a user
- `/timeout user: ms:` - Timeout a user
- `/unban id:` - Unban by user ID
- `/mod user:` - Kick with logging
- `/dmrole role: message:` - DM all role members
- `/send` - Send text or embed
- `/setrole role:` - Set allowed role
- `/setup` - Create welcome panel with rules and buttons

## Deploying Slash Commands
To register slash commands with Discord:
```bash
node deploy.js
```
Requires `DISCORD_BOT_TOKEN` and `DISCORD_APPLICATION_ID` environment variables.

## Running the Bot
```bash
node index.js
```

## Recent Changes
- Converted all CommonJS files to ES Modules for consistency
- Fixed duplicate command names (moderation.js renamed to `mod`)
- Updated token handling to use environment variables
- Fixed config property mismatches in buttonHandler
- Added claimRoles array to config
- Fixed button handler customId mismatches
