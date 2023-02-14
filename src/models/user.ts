import { Schema, model } from "mongoose";
import { IUserModel } from "../types/types";

const UserSchema = new Schema<IUserModel>({
    discordId: String,
});

const User = model<IUserModel>('Users', UserSchema);

export default User;