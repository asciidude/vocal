import type { Schema } from "mongoose"

export interface ViewedPost {
    parent_post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId
}