import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

export const ConfirmClearUserMessagesBtn = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("cancelClearBtn")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("clearMessagesBtn")
            .setLabel("Yes, clear its.")
            .setStyle(ButtonStyle.Primary),
    );