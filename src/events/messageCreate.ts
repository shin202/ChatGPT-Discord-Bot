import { Events, Message, ChannelType } from "discord.js";
import { IBotEvent } from "../types/types";
import GuildController from "../controllers/GuildController";
import dayjs from "dayjs";
import {checkPermissions, sendTimedMessage} from "../utils";

const event: IBotEvent = {
    name: Events.MessageCreate,
    execute: async (message: Message) => {
        if (!message.content || message.author.bot || !message.guild) return;

        let prefix = "";
        const guildPrefix = await GuildController.getGuildOption(message.guild.id, "prefix") as string;
        prefix = guildPrefix! ?? process.env.PREFIX;

        if (!message.content.startsWith(prefix)) return;
        if (message.channel.type !== ChannelType.GuildText) return;

        let args = message.content.substring(prefix.length).split(/\s+/);
        let command = message.client.commands.get(args[0])
            ?? message.client.commands.find(command => command.aliases.includes(args[0]));
        if (!command) return;

        const requiredPermissions = checkPermissions(message.member!, command.permissions);
        if (requiredPermissions) {
            const msg = `You don't have enough permissions to use this command.\n Required permissions: ${requiredPermissions.join(", ")}`
            return sendTimedMessage(msg, message.channel, 5000);
        }

        const cooldown = message.client.cooldowns.get(`${command.name}-${message.member?.user.id}`);
        const CURRENT_TIMESTAMP = (dayjs() as unknown as number);
        const CDDuration = dayjs(cooldown).diff(dayjs(), 's');
        const CDTime = dayjs().add(command?.cooldown!, 's').valueOf();

        if (command.cooldown && cooldown) {
            if (CURRENT_TIMESTAMP < cooldown) {
                sendTimedMessage(`You have to wait ${CDDuration} second(s) to use this command again!`, message.channel, 5000);
                return;
            }

            message.client.cooldowns.set(`${command.name}-${message.member?.user.id}`, CDTime);
            setTimeout(() => {
                message.client.cooldowns.delete(`${command?.name}-${message.member?.user.id}`);
            }, command.cooldown * 1000);
        } else if (command.cooldown && !cooldown) {
            message.client.cooldowns.set(`${command.name}-${message.member?.user.id}`, CDTime);
        }

        command.execute(message, args);
    }
}

export default event;