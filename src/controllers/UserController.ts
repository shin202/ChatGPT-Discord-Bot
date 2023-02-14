import User from "../models/user";

class UserController {
    public getUserByDiscordId = async (discordId: string) => {
        let user = await User.findOne({
            discordId,
        });

        if (!user) {
           user = await User.create({
              discordId
           });
        }

        return user;
    }
}

export default new UserController();