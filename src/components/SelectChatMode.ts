import {ChatMode} from "../types/types";
import {ActionRowBuilder, StringSelectMenuBuilder} from "discord.js";

export const selectChatMode = (currentChatMode: ChatMode) => new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("selectChatMode")
            .setPlaceholder("Select chat-mode")
            .addOptions(
                {
                    label: "Assistant",
                    description: "An advanced chatbot designed for user support named Lily.",
                    value: ChatMode.Assistant,
                    default: currentChatMode === ChatMode.Assistant,
                },
                {
                    label: "Code Assistant",
                    description: "A code assistant chatbot that helps developers with coding tasks named Steve.",
                    value: ChatMode.CodeAssistant,
                    default: currentChatMode === ChatMode.CodeAssistant
                },
                {
                    label: "Psychologist",
                    description: "A psychologist chatbot that provides mental health support and guidance named Sarah.",
                    value: ChatMode.Psychologist,
                    default: currentChatMode === ChatMode.Psychologist,
                }
            )
            .setMinValues(1)
            .setMaxValues(1)
    );