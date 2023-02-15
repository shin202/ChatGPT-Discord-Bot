import {CommandInteraction, Events, Interaction} from "discord.js";
import {ChatMode, IBotEvent} from "../types/types";
import dayjs from "dayjs";
import UserController from "../controllers/UserController";
import ConversationController from "../controllers/ConversationController";
import {selectChatMode} from "../components/SelectChatMode";
import {selectChatModeEmbed} from "../embed/SelectChatModeEmbed";

const event: IBotEvent = {
    name: Events.InteractionCreate,
    execute: async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            const { commandName, user: { id } } = interaction;
            const command = interaction.client.slashCommands.get(commandName);
            const cooldown = interaction.client.cooldowns.get(`${commandName}-${id}`);
            const CURRENT_TIMESTAMP = (dayjs() as unknown as number);
            const CDDuration = dayjs(cooldown).diff(dayjs(), 's');
            const CDTime = dayjs().add(command?.cooldown!, 's').valueOf();

            if (!command) return;
            if (command.cooldown && cooldown) {
                if (CURRENT_TIMESTAMP < cooldown) {
                    interaction.reply({
                        ephemeral: true,
                        content: `You have to wait ${CDDuration} second(s) to use this command again!`,
                    });
                    setTimeout(() => interaction.deleteReply(), 5000);
                    return;
                }

                interaction.client.cooldowns.set(`${commandName}-${id}`, CDTime);
                setTimeout(() => {
                    interaction.client.cooldowns.delete(`${commandName}-${id}`);
                }, command.cooldown * 1000);
            } else if (command.cooldown && !cooldown) {
                interaction.client.cooldowns.set(`${commandName}-${id}`, CDTime);
            }

            command.execute(interaction);

        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                if (!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (err) {
                console.error(err);
            }
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === "selectChatMode") {
                const selectedMode = interaction.values[0] as ChatMode;
                const user = (await UserController.getUserByDiscordId(interaction.user.id));
                const inConversation = await ConversationController.inConversation(user);

                if (!inConversation) {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({
                        content: `You are not in conversation or the conversation session is expired.\nPlease, start a new conversation to use this command.`,
                    });
                    setTimeout(() => interaction.deleteReply(), 5000);
                    return;
                }

                await ConversationController.setChatMode(user, selectedMode);

                const chatModeKey = Object.keys(ChatMode).find(v => Object(ChatMode)[v] === selectedMode) ?? ChatMode.Assistant;
                await interaction.update({
                    content: `Successfully change ChatMode to ${chatModeKey}`,
                    components: [selectChatMode(selectedMode)],
                    embeds: [selectChatModeEmbed((interaction as unknown as CommandInteraction), chatModeKey)],
                });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === "cancelEndConversationBtn") {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({
                    content: `Your action has been cancelled.`,
                });
                setTimeout(() => interaction.deleteReply(), 5000);
                return;
            }

            if (interaction.customId === "endConversationBtn") {
                const user = await UserController.getUserByDiscordId(interaction.user.id);
                const currentConversation = await ConversationController.getCurrentConversation(user);
                await ConversationController.expiresConversation(currentConversation!);
                await interaction.reply({
                    ephemeral: true,
                    content: `Conversation has been ended.`,
                });
                setTimeout(() => interaction.deleteReply(), 5000);
            }
        }
    },
}

export default event;