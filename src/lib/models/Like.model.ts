import { Model, model, Schema } from "mongoose";
import type { LikeType } from "$lib/types/Like.type";

const LikeSchema = new Schema({
    parent_post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId
}, { timestamps: true })

export const LikeModel: Model<LikeType> = model<LikeType>('Like', LikeSchema);