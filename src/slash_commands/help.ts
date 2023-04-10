import {SlashCommandBuilder} from "discord.js";
import {ISlashCommand} from "../types/types";
import {HelpMessageEmbed} from "../embed/HelpMessageEmbed";
import GuildController from "../controllers/GuildController";

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show help."),
    execute: async (interaction) => {
        let prefix = "";
        const guildPrefix = await GuildController.getGuildOption(interaction.guild?.id!, "prefix") as string;
        prefix = guildPrefix ?? process.env.PREFIX;

        const HELP_MESSAGES = `📍 Slash Commands: 
            🛠 /start - Start a new conversation
            🛠 /mode - Select chat mode
            🛠 /help - Show help
            🛠 /end - End conversation
            🛠 /clear - Clear all user message
            🛠 /draw - Using prompt to generate image with Stable Diffusion AI.
            \n
            📎 Prefix Commands:
            ${prefix}ask - Start asking ChatGPT bot
        `;

        await interaction.reply({
            ephemeral: true,
            embeds: [HelpMessageEmbed(interaction, HELP_MESSAGES)]
        });
    },
    cooldown: 5,
}

export default command;