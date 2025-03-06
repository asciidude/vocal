import type { Schema } from "mongoose"
import type { AttachmentType } from "./Attachment.type"

export type PostType = {
    author: Schema.Types.ObjectId,
    content: String,
    attachments: AttachmentType
}