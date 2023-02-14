import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { IBotEvent } from "../types/types";
import {color} from "../utils";

class EventHandler {
    private eventsDir = join(__dirname, "../events");

    public handler = (client: Client) => {
        readdirSync(this.eventsDir).forEach(eventFile => {
            const event: IBotEvent = require(`${this.eventsDir}/${eventFile}`).default;
            event.once ? client.once(event.name, (...args) => event.execute(...args)) :
                client.on(event.name, (...args) => event.execute(...args));
            console.log(color("event", `Successfully loaded event ${event.name}`));
        });
    }
}

export default new EventHandler();