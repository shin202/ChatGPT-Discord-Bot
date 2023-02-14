import {CommandInteraction, EmbedBuilder} from "discord.js";
import {ColorTable} from "../types/types";

export const startConversationEmbed = (interaction: CommandInteraction, currentChatMode: string, conversationTime: number) => new EmbedBuilder()
    .setColor(ColorTable.variant)
    .setTitle("Conversation has started. Now you can start chatting with ChatGPT Bot.")
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()!})
    .addFields(
        {name: "Current Mode", value: "\n"},
        {name: "\n", value: currentChatMode},
        {name: "Conversation Time", value: "\n"},
        {name: "\n", value: `${conversationTime} minutes`},
        {name: "\u200B", value: "\u200B"}
    )
    .setTimestamp()
    .setFooter({text: "Chat enabled", iconURL: interaction.user.avatarURL()!});