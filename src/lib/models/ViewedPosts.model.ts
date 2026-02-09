import { Model, model, Schema } from "mongoose";
import type { ViewedPost } from "$lib/types/ViewedPost.type";

const ViewedPostSchema = new Schema<ViewedPost>({
    parent_post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId
}, { timestamps: true })

export const ViewedPostModel: Model<ViewedPost> = model<ViewedPost>('ViewedPost', ViewedPostSchema);