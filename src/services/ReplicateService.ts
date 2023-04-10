import {IReplicateModel, ReplicateModel} from "../types/types";
import Replicate from "replicate";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
class ReplicateService {
    private REPLICATE_MODELS: IReplicateModel = {
        stableDiffusion: {
            owner: "stability-ai",
            name: "stable-diffusion",
            version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"
        },
        dreamShaper: {
            owner: "cjwbw",
            name: "dreamshaper",
            version: "ed6d8bee9a278b0d7125872bddfb9dd3fc4c401426ad634d8246a660e387475b"
        },
        openJourney: {
            owner: "prompthero",
            name: "openjourney",
            version: "9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb"
        },
        portraitPlus: {
            owner: "cjwbw",
            name: "portraitplus",
            version: "629a9fe82c7979c1dab323aedac2c03adaae2e1aecf6be278a51fde0245e20a4"
        },
        anythingV3: {
            owner: "cjwbw",
            name: "anything-v3-better-vae",
            version: "09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65"
        },
        pastelMix: {
            owner: "elct9620",
            name: "pastel-mix",
            version: "ba8b1f407cd6418fa589ca73e5c623c081600ecff19f7fc3249fa536d762bb29"
        }
    }

    public generateImage = async (prompt: string, negative_prompt: string, model: ReplicateModel) => {
        const replicate = new Replicate({
            auth: REPLICATE_API_TOKEN!,
        });

        const {owner, name, version} = this.REPLICATE_MODELS[model];

        prompt = model === ReplicateModel.OpenJourney ? `mdjrny-v4 style ${prompt}` :
            model === ReplicateModel.PortraitPlus ? `portrait+ style ${prompt}` : prompt;

        const input = {
            prompt: prompt,
            negative_prompt: negative_prompt,
            num_outputs: 4
        }

        const response = await replicate.run(`${owner}/${name}:${version}`, {
            input: input,
        });

        return response as string[];
    }
}

export default new ReplicateService();