import {Events, Guild} from "discord.js";
import { IBotEvent } from "../types/types";
import GuildModel from "../models/guild";
import dayjs from "dayjs";

const event: IBotEvent = {
    name: Events.GuildCreate,
    execute: async (guild: Guild) => {
        await GuildModel.create({
           guildId: guild.id,
            options: {},
            joinedAt: dayjs(),
        });
    }
}

export default event;