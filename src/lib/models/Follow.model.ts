import { Model, model, Schema } from "mongoose";
import type { FollowType } from "$lib/types/Follow.type";

const FollowSchema = new Schema({
    followerId: String,
    followingId: String
}, { timestamps: true })

export const FollowModel: Model<FollowType> = model<FollowType>('Follow', FollowSchema);