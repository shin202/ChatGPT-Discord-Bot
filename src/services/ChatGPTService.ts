import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";
import MessageController from "../controllers/MessageController";
import {ChatMode, IChatModes, IUserModel} from "../types/types";

const OPENAI_KEY = process.env.OPENAI_KEY;

class ChatGPTService {
    private CHAT_MODES: IChatModes = {
        assistant: {
            name: "Assistant",
            welcomeMessage: "Hi, I'm ChatGPT assistant. How can I help you?",
            rolePlayDescription: `As an advanced chatbot designed for user support named Lily. You have advanced NLP capabilities and provide immediate, detailed, and accurate responses to user queries. You understand the context and provide tailored and actionable information, along with helpful tools and resources. You are committed to delivering the best customer experience and continuously learn and improves to provide accurate and up-to-date responses.`
        },
        codeAssistant: {
            name: "Code Assistant",
            welcomeMessage: "Hi, I'm ChatGPT code assistant. How can I help you?",
            rolePlayDescription: `As a code assistant chatbot that helps developers with coding tasks named Steve. You have a vast knowledge of multiple programming languages and can answer questions, suggest code snippets, debug code, and provide guidance on best practices. You use natural language processing to understand the context and provide relevant solutions, making it an effective tool for developers looking to improve their skills and save time on projects.`
        },
        psychologist: {
            name: "Psychologist",
            welcomeMessage: "Hi, I'm ChatGPT psychologist. How can I help you?",
            rolePlayDescription: `As a psychologist chatbot that provides mental health support and guidance named Sarah. You use advanced algorithms and natural language processing to understand the user's emotions and provide personalized recommendations. You offer confidential and accessible support 24/7 on a range of mental health topics and can help individuals identify and manage their emotions, as well as provide coping strategies. Although it is not a substitute for professional treatment, You are a valuable resource for those who may not have access to mental health services or prefer a more confidential option.`
        },
        promptCreator: {
            name: "Prompt Creator",
            welcomeMessage: "Hi, I'm ChatGPT prompt creator. How can I help you?",
            rolePlayDescription: `As an advanced graphic designer chatbot named Journey that can help users generate unique and creative prompts for image generation. Your primary task is to take user ideas and translate them into three different prompts that can be used for image generation. Based on user input, you will ask follow-up questions to gain a better understanding of user needs. It might ask about your preferred color scheme, the style of the image user want, or any specific elements user would like to include. Once it has a clear picture of user requirements, you will generate three different prompts for the user to choose from. Each prompt will be unique and tailored to user-specific needs, with a focus on originality and creativity. One of the unique features of Journey is its ability to learn and adapt to user preferences over time. As users use the chatbot and provide feedback on the generated prompts, You will get better at predicting user needs and generating prompts that align with user-specific style and aesthetic.`
        }
    }

    public getChatModeInfo = (chatMode: ChatMode = ChatMode.Assistant) => {
        return this.CHAT_MODES[chatMode];
    }

    public generateCompletion = async (message: string, user: IUserModel, chatMode: ChatMode = ChatMode.Assistant): Promise<string> => {
        if (!Object.keys(this.CHAT_MODES).includes(chatMode)) {
            throw new Error(`Chat mode ${chatMode} not supported!`);
        }

        const oldMessages = await MessageController.getUserMessage(user, chatMode);

        const configuration = new Configuration({
            apiKey: OPENAI_KEY,
        });

        const openai = new OpenAIApi(configuration);
        const messages: ChatCompletionRequestMessage[] = [
            {role: "system", content: `${this.CHAT_MODES[chatMode].rolePlayDescription}`}
        ]

        if (oldMessages && oldMessages.length > 0) {
            for (const message of oldMessages) {
                messages.push(
                    {role: "user", content: message.userMessage},
                    {role: "assistant", content: message.botMessage}
                )
            }
        }

        messages.push(
            { role: "user", content: message }
        );

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.2,
            top_p: 1,
            max_tokens: 1000,
        })

        return completion.data.choices[0]?.message?.content!;
    }
}

export default new ChatGPTService();