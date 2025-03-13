import type { Schema } from "mongoose"
import type { AttachmentType } from "./Attachment.type"

export interface ReplyType {
    _id: Schema.Types.ObjectId,
    parent_post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId,
    content: String,
    attachments: Array<AttachmentType>
}