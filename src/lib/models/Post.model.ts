import { Model, model, Schema } from "mongoose";
import { AttachmentSchema } from "$lib/schemas/Attachment.schema";
import type { PostModelType } from "$lib/types/Post.type";

const PostSchema = new Schema({
    author: Schema.Types.ObjectId,
    content: String,
    attachments: [AttachmentSchema]
}, { timestamps: true })

export const PostModel: Model<PostModelType> = model<PostModelType>('Post', PostSchema);