import Message from "../models/message";
import {ChatMode, IMessageOptions, IUserModel} from "../types/types";

class MessageController {
    public getUserMessage = async (user: IUserModel, chatMode: ChatMode) => {
        return Message.find({
           user: user._id,
            chatMode,
        });
    }

    public createNewMessage = async (user: IUserModel, options: IMessageOptions) => {
        await Message.create({
           user: user._id,
            ...options,
        });
    }

    public clearUserMessage = async (userId: string) => {
        await Message.deleteMany({
            user: userId
        });
    }
}

export default new MessageController();