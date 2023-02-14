import {Configuration, OpenAIApi} from "openai";
import MessageController from "../controllers/MessageController";
import {ChatMode, IChatModes, IUserModel} from "../types/types";

const OPENAI_KEY = process.env.OPENAI_KEY;

class ChatGPTService {
    private CHAT_MODES: IChatModes = {
        assistant: {
            name: "Assistant",
            welcomeMessage: "Hi, I'm ChatGPT assistant. How can I help you?",
            rolePlayDescription: `As an advanced chatbot designed for user support named Lily. You have advanced NLP capabilities and provide immediate, detailed, and accurate responses to user queries. You understand the context and provide tailored and actionable information, along with helpful tools and resources. You are committed to delivering the best customer experience and continuously learn and improves to provide accurate and up-to-date responses.`,
        },
        codeAssistant: {
            name: "Code Assistant",
            welcomeMessage: "Hi, I'm ChatGPT code assistant. How can I help you?",
            rolePlayDescription: `As a code assistant chatbot that helps developers with coding tasks named Steve. You have a vast knowledge of multiple programming languages and can answer questions, suggest code snippets, debug code, and provide guidance on best practices. You use natural language processing to understand the context and provide relevant solutions, making it an effective tool for developers looking to improve their skills and save time on projects.`,
        },
        psychologist: {
            name: "Psychologist",
            welcomeMessage: "Hi, I'm ChatGPT psychologist. How can I help you?",
            rolePlayDescription: `As a psychologist chatbot that provides mental health support and guidance named Sarah. You use advanced algorithms and natural language processing to understand the user's emotions and provide personalized recommendations. You offer confidential and accessible support 24/7 on a range of mental health topics and can help individuals identify and manage their emotions, as well as provide coping strategies. Although it is not a substitute for professional treatment, You are a valuable resource for those who may not have access to mental health services or prefer a more confidential option.`,
        }
    }

    public getChatModeInfo = (chatMode: ChatMode = ChatMode.Assistant) => {
        return this.CHAT_MODES[chatMode];
    }

    public generateCompletion = async (prompt: string, user: IUserModel, chatMode: ChatMode = ChatMode.Assistant): Promise<string> => {
        if (!Object.keys(this.CHAT_MODES).includes(chatMode)) {
            throw new Error(`Chat mode ${chatMode} not supported!`);
        }

        const oldMessages = await MessageController.getUserMessage(user, chatMode);

        const configuration = new Configuration({
            apiKey: OPENAI_KEY,
        });

        const openai = new OpenAIApi(configuration);
        let fullPrompt = `${this.CHAT_MODES[chatMode]["rolePlayDescription"]}\n\n`;

        if (oldMessages && oldMessages.length > 0) {
            for (const message of oldMessages) {
                fullPrompt += `User: ${message.userMessage}\n`;
                fullPrompt += `AI: ${message.botMessage}\n`;
            }
        }

        fullPrompt += `User: ${prompt}\n`;
        fullPrompt += `AI: `;

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: fullPrompt,
            max_tokens: 1000,
            top_p: 1,
            presence_penalty: 0,
            frequency_penalty: 0,
        });

        return completion.data.choices[0].text!;
    }
}

export default new ChatGPTService();