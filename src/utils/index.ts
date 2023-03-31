import {
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    CommandInteraction,
    GuildMember,
    Message,
    PermissionFlagsBits,
    PermissionResolvable,
    StringSelectMenuInteraction
} from "discord.js";
import {ChatMode, ColorTable, ColorType, ComponentsCustomId} from "../types/types";
import chalk from "chalk";
import dayjs from "dayjs";
import UserController from "../controllers/UserController";
import ConversationController from "../controllers/ConversationController";
import {selectChatMode} from "../components/SelectChatMode";
import {selectChatModeEmbed} from "../embed/SelectChatModeEmbed";
import MessageController from "../controllers/MessageController";

export const sendTimedMessage = (message: Message, replyMessage: string, duration: number) => {
    message.reply(replyMessage).then((msg) => {
        setTimeout(() => msg.delete(), duration)
    });
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    const requiredPermissions: PermissionResolvable[] = [];
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) requiredPermissions.push(permission);
    });

    if (requiredPermissions.length === 0) return null;

    return requiredPermissions.map(permission => {
        if (typeof permission === "string") return permission;
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === permission);
    });
}

export const color = (color: ColorType, message: any) => {
    return chalk.hex(ColorTable[color])(message);
}

export const handleError = (err: any) => console.log(color("error", `Got an Error: ${err}`));

export const handleChatInputCommand = (interaction: ChatInputCommandInteraction) => {
    const {commandName, user: {id}} = interaction;
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
}

export const handleCommandAutoComplete = (interaction: AutocompleteInteraction) => {
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
}

export const handleChatModeChange = async (interaction: StringSelectMenuInteraction) => {
    if (interaction.customId === ComponentsCustomId.SelectChatMode) {
        const selectedMode = interaction.values[0] as ChatMode;
        const user = (await UserController.getUserByDiscordId(interaction.user.id));
        const inConversation = await ConversationController.inConversation(user);

        if (!inConversation) {
            await interaction.deferReply({ephemeral: true});
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
}

export const handleEndConversation = async (interaction: ButtonInteraction) => {
    switch (interaction.customId) {
        case ComponentsCustomId.CancelEndConversation:
            await interaction.update({
                content: `Your action has been cancelled.`,
            });
            setTimeout(() => interaction.deleteReply(), 5000);
            break;
        case ComponentsCustomId.EndConversation:
            const user = await UserController.getUserByDiscordId(interaction.user.id);
            await MessageController.clearUserMessage(user);
            await ConversationController.endConversation(user);
            await interaction.update({
                content: `Conversation has been ended.`,
            });
            setTimeout(() => interaction.deleteReply(), 5000);
            break;

        default:
            break;
    }
}

export const handleClearUserMessage = async (interaction: ButtonInteraction) => {
    switch (interaction.customId) {
        case ComponentsCustomId.CancelClearMessages:
            await interaction.update({
                content: `Your action has been cancelled.`,
            });
            setTimeout(() => interaction.deleteReply(), 5000);
            break;

        case ComponentsCustomId.ClearMessages:
            const user = await UserController.getUserByDiscordId(interaction.user.id);
            await MessageController.clearUserMessage(user);
            await interaction.update({
                content: `Successfully clear all messages of this user.`,
            });
            setTimeout(() => interaction.deleteReply(), 5000);
            break;

        default:
            break;
    }
}

export const isAdmin = (member: GuildMember) => {
    return member.permissions.has("Administrator");
}