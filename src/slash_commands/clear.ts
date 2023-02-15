import {CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder} from "discord.js";
import {ISlashCommand} from "../types/types";
import {ClearMessageEmbed} from "../embed/ClearMessageEmbed";
import {ConfirmClearUserMessagesBtn} from "../components/ConfirmClearUserMessagesBtn";
import {isAdmin} from "../utils";
import MessageController from "../controllers/MessageController";

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear all user messages")
        .addSubcommand(subcommand =>
            subcommand.setName("user")
                .setDescription("The user to clear messages")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("The user")
                        .setRequired(true)
                ),
        )
        .addSubcommand(subcommand =>
            subcommand.setName("all")
                .setDescription("Clear all messages of all users")
        ),
    execute: async (interaction) => {
        if ((interaction.options as CommandInteractionOptionResolver).getSubcommand() === "user") {
            const target = interaction.options.getUser("target");

            if (target?.bot) return;

            const member = interaction.member as GuildMember;
            if (!isAdmin(member) || target?.id !== interaction.user.id) {
                await interaction.reply({
                    ephemeral: true,
                    content: `You don't have permissions to do this 🚫.`,
                });
                setTimeout(() => interaction.deleteReply(), 5000);
                return;
            }

            await interaction.reply({
                ephemeral: true,
                embeds: [ClearMessageEmbed(interaction, target)],
                components: [ConfirmClearUserMessagesBtn],
            });
        } else if ((interaction.options as CommandInteractionOptionResolver).getSubcommand() === "all") {
            const member = interaction.member as GuildMember;
            if (!isAdmin(member)) {
                await interaction.reply({
                    ephemeral: true,
                    content: `You don't have permissions to do this 🚫.`,
                });
                setTimeout(() => interaction.deleteReply(), 5000);
                return;
            }

            await MessageController.clearAll();
            await interaction.reply({
                ephemeral: true,
                content: `All messages of all user have been cleared.`
            });
            setTimeout(() => interaction.deleteReply(), 5000);
        }
    }
}

export default command;