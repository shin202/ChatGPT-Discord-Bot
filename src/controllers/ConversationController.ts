import Conversation from "../models/conversation";
import {ChatMode, ConversationStatus, IConversationModel, IUserModel} from "../types/types";
import dayjs from "dayjs";

class ConversationController {
    public startNewConversation = async (user: IUserModel, conversationExpires?: Date|number) => {
        await this.deleteConversation(user);

        return Conversation.create({
            user: user._id,
            conversationStatus: ConversationStatus.Active,
            conversationExpiredAt: conversationExpires,
        });
    }

    public deleteConversation = async (user: IUserModel) => {
        await Conversation.deleteMany({
            user: user._id,
        });
    }

    public inConversation = async (user: IUserModel): Promise<boolean> => {
        const conversation = await Conversation.findOne({
            user: user._id,
        });

        if (!conversation) return false;
        await this.expiresConversation(conversation);
        return conversation.conversationStatus === ConversationStatus.Active;
    }

    /**
     * Expires all conversation.
     *
     * @param conversation
     */
    public expiresConversation = async (conversation: IConversationModel) => {
        if (dayjs() > dayjs(conversation.conversationExpiredAt)) {
            conversation.conversationStatus = ConversationStatus.NotActive;
            await conversation.save();
        }
    }

    public setChatMode = async (user: IUserModel, chatMode: ChatMode) => {
        const conversation = await Conversation.findOne({
            user: user._id,
        });

        if (!conversation) return;

        conversation.currentChatMode = chatMode;
        conversation.save();
    }

    public getCurrentChatMode = async (user: IUserModel) => {
        const conversation = await Conversation.findOne({
            user: user._id,
        });

        if (!conversation) return;

        return conversation.currentChatMode;
    }

    public getCurrentConversation = async (user: IUserModel) => {
        return Conversation.findOne({
            user: user._id,
        });
    }
}

export default new ConversationController();