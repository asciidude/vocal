import { Model, model, Schema } from "mongoose";
import type { MailingSubscriberType } from "$lib/types/MailingSubscriber.type";

const MailingSubscriberSchema = new Schema<MailingSubscriberType>({
    email: String
}, { timestamps: true })

export const MailingSubscriberModel: Model<MailingSubscriberType> = model<MailingSubscriberType>('MailingSubscriber', MailingSubscriberSchema);