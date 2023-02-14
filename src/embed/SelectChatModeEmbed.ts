import {ColorTable} from "../types/types";
import {EmbedBuilder} from "discord.js";

export const selectChatModeEmbed = (chatModeKey: string) => new EmbedBuilder()
    .setColor(ColorTable.variant)
    .setTitle("Select your chat-mode.")
    .setDescription("Setup ChatGPT mode.")
    .addFields(
        { name: "Current Mode", value: chatModeKey},
    );