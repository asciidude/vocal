import type { Schema } from "mongoose"

export type FollowsModelType = {
    followerId: Schema.Types.ObjectId,
    followingId: Schema.Types.ObjectId
}