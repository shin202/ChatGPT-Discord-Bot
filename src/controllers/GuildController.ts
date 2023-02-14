import Guild from "../models/guild";
import {IGuildModel, GuildOptionType} from "../types/types";

class GuildController {
    public getGuildOption = async (guildId: string, option: GuildOptionType) => {
        const guild: IGuildModel | null = await Guild.findOne({
            guildId
        });

        if (!guild) return null;

        return guild.options[option];
    }

    public setGuildOption = async (guildId: string, option: GuildOptionType, value: number|string) => {
        const guild: IGuildModel | null = await Guild.findOne({
            guildId
        });

        if (!guild) return null;

        (guild.options[option] as number|string) = value;
        await guild.save();
    }
}

export default new GuildController();