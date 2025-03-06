import { Model, model, Schema } from "mongoose";
import type { UserType } from "$lib/types/User.types";

const UserSchema = new Schema({
    discordId: {
        type: String,
        required: true
    },

    avatarUrl: String,
    username: {
        type: String,
        required: true
    },
    displayName: String,

    bio: String,
    roles: Array
}, { timestamps: true })

export const UserModel: Model<UserType> = model<UserType>('User', UserSchema);