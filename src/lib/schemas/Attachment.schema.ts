import type { AttachmentTypes } from "$lib/types/Attachment.type";
import { Schema } from "mongoose";

export const AttachmentSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'video', 'audio', 'file'],
        required: true
    },
    name: String,
    size: Number
});