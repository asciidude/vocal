import type { Schema } from "mongoose"
import type { AttachmentType } from "./Attachment.type"

export type PostType = {
    _id: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId,
    content: String,
    attachments: Array<AttachmentType>
}