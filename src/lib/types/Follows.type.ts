import type { Schema } from "mongoose"

export type FollowsType = {
    followerId: Schema.Types.ObjectId,
    followingId: Schema.Types.ObjectId
}