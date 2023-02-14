import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {ColorTable, ISlashCommand} from "../types/types";
import ConversationController from "../controllers/ConversationController";
import UserController from "../controllers/UserController";
import GuildController from "../controllers/GuildController";
import dayjs from "dayjs";

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Start a new conversation with ChatGPT Bot."),
    execute: async (interaction) => {
        const user = await UserController.getUserByDiscordId(interaction.user.id);
        const inConversation = await ConversationController.inConversation(user);

        if (inConversation) {
            await interaction.reply({
                ephemeral: true,
                content:  `You are in a conversation, to start a new conversation, please use the (/end) command to end this conversation then use this command again.`,
            });

            setTimeout(() => interaction.deleteReply(), 5000);
            return;
        }

        let conversationTime = null;
        const guildConversationTime = await GuildController.getGuildOption(interaction.guild?.id!, "conversationTime") as number;
        conversationTime = guildConversationTime ?? parseInt(process.env.CONVERSATION_TIME!);
        const conversationExpires = dayjs().add(conversationTime, 'm').valueOf();
        const conversation = await ConversationController.startNewConversation(user, conversationExpires);
        const { currentChatMode } = conversation;

        const embed = new EmbedBuilder()
            .setColor(ColorTable.variant)
            .setTitle("Conversation has started. Now you can start chatting with ChatGPT Bot.")
            .setAuthor({ name:  interaction.user.tag, iconURL: interaction.user.avatarURL()!})
            .addFields(
                { name: "Current Mode", value: currentChatMode },
                { name: "Conversation Time", value: `${conversationTime} minutes` }
            )
            .setTimestamp()
            .setFooter({ text: "Chat enabled", iconURL: interaction.user.avatarURL()! });

        await interaction.reply({ ephemeral: true, embeds: [embed] });
    }
}

export default command;