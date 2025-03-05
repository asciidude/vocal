import mongoose, { Model } from "mongoose";
import type { UserModelType, FollowObjectType } from "$lib/types/User.types";

const UserSchema = new mongoose.Schema({
    discordId: String,

    avatarUrl: String,
    username: String,
    displayName: String,

    bio: String,
    followers: Array<FollowObjectType>,
    following: Array<FollowObjectType>
}, { timestamps: true })

export const UserModel: Model<UserModelType> = mongoose.model<UserModelType>('User', UserSchema);