import {Events, Interaction} from "discord.js";
import {IBotEvent} from "../types/types";
import {
    handleChatInputCommand,
    handleChatModeChange,
    handleClearUserMessage,
    handleCommandAutoComplete,
    handleEndConversation
} from "../utils";

const event: IBotEvent = {
    name: Events.InteractionCreate,
    execute: async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            handleChatInputCommand(interaction);
        } else if (interaction.isAutocomplete()) {
            handleCommandAutoComplete(interaction);
        } else if (interaction.isStringSelectMenu()) {
            await handleChatModeChange(interaction);
        } else if (interaction.isButton()) {
            await handleEndConversation(interaction);
            await handleClearUserMessage(interaction);
        }
    },
}

export default event;