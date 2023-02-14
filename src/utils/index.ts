import {GuildMember, Message, PermissionFlagsBits, PermissionResolvable} from "discord.js";
import {ColorTable, ColorType} from "../types/types";
import chalk from "chalk";

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

