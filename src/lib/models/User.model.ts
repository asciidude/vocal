import { Model, model, Schema } from "mongoose";
import type { UserModelType, FollowObjectType } from "$lib/types/User.types";

const UserSchema = new Schema({
    discordId: String,

    avatarUrl: String,
    username: String,
    displayName: String,

    bio: String,
    followers: Array<FollowObjectType>,
    following: Array<FollowObjectType>
}, { timestamps: true })

export const UserModel: Model<UserModelType> = model<UserModelType>('User', UserSchema);