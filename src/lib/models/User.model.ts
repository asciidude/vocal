import { Model, model, Schema } from "mongoose";
import type { UserType } from "$lib/types/User.types";
import { AuthProviderSchema } from "../schemas/AuthProvider.schema";

const UserSchema = new Schema<UserType>({
    avatarUrl: String,
    bannerUrl: String, // url or "none"
    
    authProviders: {
        type: [AuthProviderSchema],
        require: true,
        default: []
    },

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
    },
    
    userInterestVectors: Object
}, { timestamps: true })

export const UserModel: Model<UserType> = model<UserType>('User', UserSchema);