import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

export const ConfirmEndConversationBtn = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("cancelEndConversationBtn")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("endConversationBtn")
            .setLabel("Yes, end this.")
            .setStyle(ButtonStyle.Primary),
    );