import type { Schema } from "mongoose"

export interface LikeType {
    parent_post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId
}