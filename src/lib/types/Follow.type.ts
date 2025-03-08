import type { Schema } from "mongoose"

export type FollowType = {
    followerId: Schema.Types.ObjectId,
    followingId: Schema.Types.ObjectId
}