import { Schema, model } from "mongoose";
import {IGuildModel} from "../types/types";
import dayjs from "dayjs";

const GuildSchema = new Schema<IGuildModel>({
   guildId: {
       required: true,
       type: String,
   },
    options: {
       prefix: {
           type: String,
           default: process.env.PREFIX,
       },
        conversationTime: {
           type: Number,
            default: parseInt(process.env.CONVERSATION_TIME!),
        }
    },
    joinedAt: {
       type: Date,
        default: () => dayjs(),
    }
});

const Guild = model<IGuildModel>('Guilds', GuildSchema);

export default Guild;

