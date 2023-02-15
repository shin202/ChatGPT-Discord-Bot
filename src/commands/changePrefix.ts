import {ICommand} from "../types/types";
import GuildController from "../controllers/GuildController";

const command: ICommand = {
    name: "prefix",
    execute: async (message, args) => {
        if (!args[1]) return;
        let prefix = args[1];
        await GuildController.setGuildOption(message.guild?.id!, "prefix", prefix);
        message.channel.send(`Successfully changed prefix to ${prefix}`);
    },
    aliases: ["changePrefix"],
    permissions: ["Administrator"],
}

export default command;