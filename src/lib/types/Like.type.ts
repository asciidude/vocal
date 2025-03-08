import type { Schema } from "mongoose"

export type LikeType = {
    parent_post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId
}