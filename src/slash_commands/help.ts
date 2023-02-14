import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/types";
import {HelpMessageEmbed} from "../embed/HelpMessageEmbed";

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show help."),
    execute: async (interaction) => {
        const HELP_MESSAGES = `📍 Slash Commands: 
            🛠 /start - Start a new conversation
            🛠 /mode - Select chat mode
            🛠 /help - Show help
            🛠 /end - End conversation
            🛠 /clear - Clear all user message
            \n
            📎 Prefix Commands:
            !ask - Start asking ChatGPT bot
        `;

        await interaction.reply({
            ephemeral: true,
            embeds: [HelpMessageEmbed(interaction, HELP_MESSAGES)]
        });
    },
    cooldown: 5,
}

export default command;