import {ColorTable} from "../types/types";
import {CommandInteraction, EmbedBuilder} from "discord.js";

export const EndConversationEmbed = (interaction: CommandInteraction, remainingTime: number) => new EmbedBuilder()
    .setColor(ColorTable.variant)
    .setTitle("Do you want to end the conversation?")
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()!})
    .addFields(
        {name: "Remaining Time: ", value: `${remainingTime} minute(s).`, inline: true},
        {name: "\u200B", value: "\u200B"}
    )
    .setTimestamp()
    .setFooter({text: "End conversation", iconURL: interaction.user.avatarURL()!});