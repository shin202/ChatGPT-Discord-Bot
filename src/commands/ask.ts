import {ICommand} from "../types/types";
import UserController from "../controllers/UserController";
import ConversationController from "../controllers/ConversationController";
import ChatGPTService from "../services/ChatGPTService";
import MessageController from "../controllers/MessageController";

const command: ICommand = {
    name: "ask",
    execute: async (message, args) => {
        await message.channel.sendTyping();

        const user = await UserController.getUserByDiscordId(message.author.id);
        const inConversation = await ConversationController.inConversation(user);

        if (!inConversation) {
           await message.reply('You are not in conversation or the conversation session is expired.\nPlease start a new conversation to use this command.');
           return;
        }

        const currentChatMode = await ConversationController.getCurrentChatMode(user);
        if (!args[1]) {
            const { welcomeMessage } = ChatGPTService.getChatModeInfo(currentChatMode);
            await message.reply(welcomeMessage);
            return;
        }

        const userMessage = args.slice(1).join(" ");
        const resMessage = await ChatGPTService.generateCompletion(userMessage, user, currentChatMode);
        await MessageController.createNewMessage(user, {
           chatMode: currentChatMode!,
           userMessage: userMessage,
           botMessage: resMessage,
        });
        await message.reply(resMessage);
    },
    permissions: [],
    aliases: ["chat"],
    cooldown: 5,
}

export default command;