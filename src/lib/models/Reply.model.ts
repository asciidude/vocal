import { Model, model, Schema } from "mongoose";
import type { ReplyType } from "$lib/types/Reply.type";
import { AttachmentSchema } from "$lib/schemas/Attachment.schema";

const ReplySchema = new Schema<ReplyType>({
    parent_post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId,
    content: String,
    attachments: [AttachmentSchema]
}, { timestamps: true })

export const ReplyModel: Model<ReplyType> = model<ReplyType>('Reply', ReplySchema);