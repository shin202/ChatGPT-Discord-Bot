import {ColorTable} from "../types/types";
import {CommandInteraction, EmbedBuilder} from "discord.js";

export const selectChatModeEmbed = (interaction: CommandInteraction, chatModeKey: string) => new EmbedBuilder()
    .setColor(ColorTable.variant)
    .setTitle("Select your chat mode.")
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()!})
    .setDescription("Setup ChatGPT mode.")
    .addFields(
        {name: "Current Mode", value: "\n"},
        {name: "\n", value: chatModeKey},
        {name: "\u200B", value: "\u200B"}
    )
    .setTimestamp()
    .setFooter({text: "Select chat mode", iconURL: interaction.user.avatarURL()!});