import {SlashCommandBuilder,} from "discord.js";
import {ChatMode, ISlashCommand} from "../types/types";
import UserController from "../controllers/UserController";
import ConversationController from "../controllers/ConversationController";
import {selectChatMode} from "../components/SelectChatMode";
import {selectChatModeEmbed} from "../embed/SelectChatModeEmbed";

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
        .setName("mode")
        .setDescription("Setup ChatGPT mode."),
    execute: async (interaction) => {
        const user = await UserController.getUserByDiscordId(interaction.user.id);
        const currentChatMode = await ConversationController.getCurrentChatMode(user);
        const chatModeKey = Object.keys(ChatMode).find(v => Object(ChatMode)[v] === currentChatMode) ?? ChatMode.Assistant;
        await interaction.reply({
            ephemeral: true,
            embeds: [selectChatModeEmbed(interaction, chatModeKey)],
            components: [selectChatMode(currentChatMode!)]
        });
    }
}

export default command;