import { Model, model, Schema } from "mongoose";
import type { UserType } from "$lib/types/User.types";
import { AuthProviderSchema } from "../schemas/AuthProvider.schema";

const UserSchema = new Schema({
    authProviders: {
        type: [AuthProviderSchema],
        require: true,
        default: []
    },

    avatarUrl: String,
    bannerUrl: String, // url or "none"
    
    username: {
        type: String,
        required: true
    },
    displayName: String,

    bio: String,
    roles: {
        type: [String],
        enum: ['tester', 'beta', 'admin', 'superadmin'],
        default: []
    }
}, { timestamps: true })

export const UserModel: Model<UserType> = model<UserType>('User', UserSchema);