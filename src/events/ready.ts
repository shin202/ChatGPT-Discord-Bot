import {Client, Interaction, Events } from "discord.js";
import { IBotEvent } from "../types/types";

const event: IBotEvent = {
    name: Events.ClientReady,
    once: true,
    execute: (client: Client) => {
        console.log(`Logged in as ${client.user!.tag}`);
    }
}

export default event;