import { json, type RequestHandler } from "@sveltejs/kit";
import * as EmailValidator from "email-validator";
import { MailingSubscriberModel } from "src/lib/models/MailingSubscriber.model";
import { sendMail } from "src/lib/utils/Mailer.util";

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const body = await request.json();
        const email = body.email?.trim();

        if (!email) {
            return json({ success: false, message: "No email provided" }, { status: 400 });
        }

        if (!EmailValidator.validate(email)) {
            return json({ success: false, message: "Email is invalid" }, { status: 400 });
        }

        const endpoint = process.env.MAILING_LIST_ALERTS;
        if (!endpoint) {
            return json({ success: false, message: "Mailing list endpoint not configured" }, { status: 500 });
        }

        const subscribed = await MailingSubscriberModel.findOne({ email });

        if (!subscribed) {
            return json({ success: false, message: "You are not subscribed" }, { status: 400 });
        }

        await MailingSubscriberModel.findOneAndDelete({ email });

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: `${email} has unsubscribed from the mailing list.` })
        });

        if (!res.ok) {
            return json({ success: false, message: "Failed to notify mailing endpoint" }, { status: 502 });
        }

        await sendMail(
            [{ email }],
            null,
            "You're unsubscribed",
            "You have been unsubscribed from our mailing list.",
            `
        <p>We have unsubscribed you from our mailing list, you will no longer receive mail from us.</p>
        <p>We're sorry to see you go. If you have any feedback, please <a href="https://discord.gg/4Rwr2pu2bW">let us know</a>.</p>
      `,
            null
        );

        return json({ success: true, message: "You have been unsubscribed successfully." }, { status: 200 });

    } catch (err: any) {
        console.error("Unsubscribe error:", err);
        return json({ success: false, message: err?.message || "Unknown error" }, { status: 500 });
    }
};
