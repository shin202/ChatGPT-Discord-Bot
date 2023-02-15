import { Document } from "mongoose";
import {
    AutocompleteInteraction,
    CommandInteraction,
    SlashCommandBuilder,
    Collection,
    Message,
    PermissionResolvable
} from "discord.js";

export interface ISlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction: CommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number,
}

export interface ICommand {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, ICommand>,
        slashCommands: Collection<string, ISlashCommand>,
        cooldowns: Collection<string, number>
    }
}

export interface IBotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args: any) => void,
}

export enum ColorTable {
    mongodb = "#03C988",
    event = "#6B76FF",
    commands = "#EA8FEA",
    slashCommands = "#C780FA",
    error = "#FF0032",
    variant = "#00FFC6",
}

export type ColorType = "mongodb" | "event" | "commands" | "slashCommands" | "error" | "variant";

export interface IChatModeInfo {
    name: string,
    welcomeMessage: string,
    rolePlayDescription: string,
}

export interface IChatModes {
    assistant: IChatModeInfo,
    codeAssistant: IChatModeInfo,
    psychologist: IChatModeInfo,
}

export enum ChatMode {
    Assistant = "assistant",
    CodeAssistant = "codeAssistant",
    Psychologist = "psychologist",
}

export interface IMessageOptions {
    userMessage: string,
    botMessage: string,
    chatMode: ChatMode,
}

export interface IMessage extends IMessageOptions {
    user: {
        type: any,
        ref: string,
    },
}

export interface IMessageModel extends IMessage, Document{};

export interface IUser {
    discordId: string,
}

export interface IUserModel extends IUser, Document{};

export interface IGuildOptions {
    prefix: string,
    conversationTime: number,
}

export type GuildOptionType = "prefix" | "conversationTime";

export interface IGuild {
    guildId: string,
    options: IGuildOptions,
    joinedAt: Date,
}

export interface IGuildModel extends IGuild, Document{};

export enum ConversationStatus {
    Active = 1,
    NotActive = 0,
}

export interface IConversation {
    user: {
        type: string,
        ref: string,
    },
    currentChatMode: ChatMode,
    conversationStatus: ConversationStatus,
    conversationExpiredAt: Date,
}

export interface IConversationModel extends IConversation, Document{};

export enum ComponentsCustomId {
    SelectChatMode = "selectChatMode",
    CancelEndConversation = "cancelEndConversationBtn",
    EndConversation = "endConversationBtn",
}