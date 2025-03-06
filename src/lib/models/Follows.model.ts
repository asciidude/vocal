import { Model, model, Schema } from "mongoose";
import type { FollowsType } from "$lib/types/Follows.type";

const UserSchema = new Schema({
    followerId: String,
    followingId: String
}, { timestamps: true })

export const UserModel: Model<FollowsType> = model<FollowsType>('Follows', UserSchema);