import { Schema, model } from "mongoose";
import {ChatMode, ConversationStatus, IConversationModel} from "../types/types";
import dayjs from "dayjs";

const ConversationSchema = new Schema<IConversationModel>({
   user: {
       type: Schema.Types.ObjectId,
       ref: 'Users',
   },
    currentChatMode: {
       type: String,
        enum: ChatMode,
        default: ChatMode.Assistant,
    },
   conversationStatus: {
       type: Number,
       default: ConversationStatus.NotActive,
   },
    conversationExpiredAt: {
       type: Date,
        default: () => dayjs().add(parseInt(process.env.CONVERSATION_TIME!), 'm').valueOf(),
    }
});

const Conversation = model<IConversationModel>('Conversations', ConversationSchema);

export default Conversation;