import {CommandInteraction, EmbedBuilder, User} from "discord.js";
import {ColorTable} from "../types/types";

export const ClearMessageEmbed = (interaction: CommandInteraction, target: User) => new EmbedBuilder()
    .setColor(ColorTable.variant)
    .setTitle("Are you sure you wanna clear all message of this user?")
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()!})
    .setDescription("Clear all user messages")
    .addFields(
        {name: "User to clear messages", value: "\n"},
        {name: "\n", value: target.tag},
        {name: "\u200B", value: "\u200B"}
    )
    .setTimestamp()
    .setFooter({text: "Clear messages", iconURL: interaction.user.avatarURL()!});