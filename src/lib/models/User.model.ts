import { Model, model, Schema } from "mongoose";
import type { UserModelType } from "$lib/types/User.types";

const UserSchema = new Schema({
    discordId: String,

    avatarUrl: String,
    username: String,
    displayName: String,

    bio: String,
    roles: []
}, { timestamps: true })

export const UserModel: Model<UserModelType> = model<UserModelType>('User', UserSchema);