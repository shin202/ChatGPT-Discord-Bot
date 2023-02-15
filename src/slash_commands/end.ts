import {ButtonStyle, SlashCommandBuilder} from "discord.js";
import {ISlashCommand} from "../types/types";
import UserController from "../controllers/UserController";
import ConversationController from "../controllers/ConversationController";
import dayjs from "dayjs";
import {EndConversationEmbed} from "../embed/EndConversationEmbed";
import {ConfirmEndConversationBtn} from "../components/ConfirmEndConversationBtn";

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
        .setName("end")
        .setDescription("End conversation"),
    execute: async (interaction) => {
        const user = await UserController.getUserByDiscordId(interaction.user.id);
        const inConversation = await ConversationController.inConversation(user);

        if (!inConversation) {
            await interaction.reply({
                ephemeral: true,
                content: `You are not in a conversation. So you don't need do this.😁`,
            });
            setTimeout(() => interaction.deleteReply(), 5000);
            return;
        }

        const currentConversation = await ConversationController.getCurrentConversation(user);
        const {conversationExpiredAt} = currentConversation!;
        const remainingTime = dayjs(conversationExpiredAt).diff(dayjs(), 'm');

        await interaction.reply({
            ephemeral: true,
            embeds: [EndConversationEmbed(interaction, remainingTime)],
            components: [
                ConfirmEndConversationBtn
            ],
        });
    },
    cooldown: 5,
}

export default command;