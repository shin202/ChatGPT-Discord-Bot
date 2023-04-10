import {AttachmentBuilder, CommandInteractionOptionResolver, SlashCommandBuilder} from "discord.js";
import {ISlashCommand, ReplicateModel} from "../types/types";
import ReplicateService from "../services/ReplicateService";

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
        .setName("draw")
        .setDescription("Using prompt to generate image with SD AI")
        .addStringOption(option =>
            option.setName("model")
                .setDescription("Model use for generate.")
                .setRequired(true)
                .addChoices(
                    {name: "Stable Diffusion", value: ReplicateModel.StableDiffusion},
                    {name: "Open Journey", value: ReplicateModel.OpenJourney},
                    {name: "Dream Shaper", value: ReplicateModel.DreamShaper},
                    {name: "Portrait Plus", value: ReplicateModel.PortraitPlus},
                    {name: "Anything V3", value: ReplicateModel.AnythingV3},
                    {name: "Pastel Mix", value: ReplicateModel.PastelMix}
                )
        )
        .addStringOption(option =>
            option.setName("prompt")
                .setDescription("Your prompt")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("negative_prompt")
                .setDescription("Things that you don't want to see in the output.")
                .setRequired(false)
        ),
    execute: async (interaction) => {
        const model = (interaction.options as CommandInteractionOptionResolver).get("model");
        const prompt = (interaction.options as CommandInteractionOptionResolver).getString("prompt");
        const negative_prompt = (interaction.options as CommandInteractionOptionResolver).getString("negative_prompt") || "";


        await interaction.deferReply();
        const images = await ReplicateService.generateImage(prompt!, negative_prompt, model?.value as ReplicateModel);
        const files = images.map(image => new AttachmentBuilder(image));
        await interaction.editReply({
            content: `${prompt}`,
            files: files,
        });
    },
    cooldown: 300
}

export default command;