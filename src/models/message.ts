import { Schema, model } from "mongoose";
import {ChatMode, IMessageModel} from "../types/types";

const MessageSchema = new Schema<IMessageModel>({
   user: {
       type: Schema.Types.ObjectId,
       ref: 'Users',
   },
    userMessage: String,
    botMessage: String,
    chatMode: {
       required: true,
        type: String,
        enum: ChatMode,
    },
});

const Message = model<IMessageModel>('Messages', MessageSchema);

export default Message;