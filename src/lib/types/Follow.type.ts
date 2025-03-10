import type { Schema } from "mongoose"

export interface FollowType {
    followerId: Schema.Types.ObjectId,
    followingId: Schema.Types.ObjectId
}