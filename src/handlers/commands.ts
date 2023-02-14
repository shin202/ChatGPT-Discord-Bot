import {Client, REST, Routes, SlashCommandBuilder} from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";
import {ICommand, ISlashCommand} from "../types/types";
import {color} from "../utils";
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

class CommandHandler {
    private slashCommands: SlashCommandBuilder[] = [];
    private slashCommandsDir = join(__dirname, '../slash_commands');
    private commands: ICommand[] = [];
    private commandsDir = join(__dirname, '../commands');
    private COMMAND_FILE_SUFFIX = ".ts";

    public handler = (client: Client) => {
        readdirSync(this.slashCommandsDir).forEach(commandFile => this.registerSlashCommand(client, commandFile));
        readdirSync(this.commandsDir).forEach(commandFile => this.registerCommand(client, commandFile));
        this.deployCommands();
    }

    private registerSlashCommand = (client: Client, commandFile: string) => {
        if (!commandFile.endsWith(this.COMMAND_FILE_SUFFIX)) return;
        const command: ISlashCommand = require(`${this.slashCommandsDir}/${commandFile}`).default;
        this.slashCommands.push(command.command);
        client.slashCommands.set(command.command.name, command);
    }

    private registerCommand = (client: Client, commandFile: string) => {
        if (!commandFile.endsWith(this.COMMAND_FILE_SUFFIX)) return;
        const command: ICommand = require(`${this.commandsDir}/${commandFile}`).default;
        this.commands.push(command);
        client.commands.set(command.name, command);
    }

    private deployCommands = () => {
        const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN!);

        (async () => {
           try {
               console.log(color("slashCommands", `Started refreshing ${this.slashCommands.length} application (/) command(s).`));
               console.log(color("commands", `Started refreshing ${this.commands.length} command(s).`));

               const data: any = await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), {
                   body: this.slashCommands.map(command => command.toJSON()),
               });

               console.log(color("slashCommands", `Successfully reloaded ${data.length} application (/) command(s).`));
               console.log(color("commands", `Successfully reloaded ${this.commands.length} command(s).`));
           } catch (err) {
               console.error(err);
           }
        })();
    }
}

export default new CommandHandler();