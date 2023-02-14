import {ColorTable} from "../types/types";
import {CommandInteraction, EmbedBuilder} from "discord.js";

export const HelpMessageEmbed = (interaction: CommandInteraction, helpMessage: string) => new EmbedBuilder()
    .setColor(ColorTable.variant)
    .setTitle("Help Menu")
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()!})
    .setDescription("All supported commands/slash commands.")
    .addFields(
        {name: "Commands/Slash Commands", value: "\n"},
        {name: "\n", value: helpMessage},
        {name: "\u200B", value: "\u200B"},
    )
    .setTimestamp()
    .setFooter({text: "help", iconURL: interaction.user.avatarURL()!});