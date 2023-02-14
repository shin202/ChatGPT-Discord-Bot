import { ICommand } from "../types/types";
import {PermissionsBitField} from "discord.js";

const command: ICommand = {
    name: "hello",
    execute: (message, args) => {
        message.channel.send(`Hello`);
    },
    cooldown: 20,
    aliases: ["sayhello"],
    permissions: [PermissionsBitField.Flags.Administrator],
}

export default command;