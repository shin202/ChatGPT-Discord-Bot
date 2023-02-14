import "dotenv/config";
import {Client, GatewayIntentBits, Collection } from "discord.js";
const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
import MongoDBService from "./services/MongoDBService";
import {ICommand, ISlashCommand} from "./types/types";
import {join} from "path";
import {readdirSync} from "fs";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
    intents: [
        Guilds,
        GuildMessages,
        MessageContent,
    ]
});

MongoDBService.connect().then(() => {
    client.slashCommands = new Collection<string, ISlashCommand>();
    client.commands = new Collection<string, ICommand>();
    client.cooldowns = new Collection<string, number>();

    const handlersDir = join(__dirname, "./handlers");
    readdirSync(handlersDir).forEach(handlerFile => {
        require(`${handlersDir}/${handlerFile}`).default.handler(client);
    });
});

client.login(DISCORD_BOT_TOKEN);

