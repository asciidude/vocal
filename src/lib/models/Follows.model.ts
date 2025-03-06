import { Model, model, Schema } from "mongoose";
import type { FollowsModelType } from "$lib/types/Follows.type";

const UserSchema = new Schema({
    followerId: String,
    followingId: String
}, { timestamps: true })

export const UserModel: Model<FollowsModelType> = model<FollowsModelType>('Follows', UserSchema);