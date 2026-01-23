import { error, json, type RequestHandler } from "@sveltejs/kit";
import * as EmailValidator from "email-validator";
import { MailingSubscriberModel } from "src/lib/models/MailingSubscriber.model";
import { sendMail } from "src/lib/utils/Mailer.util";

export const POST: RequestHandler = async ({ request, fetch }) => {
    const body = await request.json();
    const email = body.email;
    
    if (!email) {
        throw error(400, "No email provided");
    }

    if (!EmailValidator.validate(email)) {
        throw error(400, "Email is invalid");
    }

    const endpoint = process.env.MAILING_LIST_ALERTS;
    if (!endpoint) {
        throw error(500, "Mailing list endpoint not configured");
    }

    const subscribed = await MailingSubscriberModel.findOne({ email });

    if (subscribed) {
        await MailingSubscriberModel.findOneAndDelete({ email: email.trim() });

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: `${email} has unsubscribed from the mailing list.`
            })
        });

        if (!res.ok) {
            throw error(502, "Failed to subscribe email");
        }

        await sendMail(
            [{ email }],
            null,
            'You\'re unsubscribed',
            'You have been unsubscribed from our mailing list.',
            `
                <p>We have unsubscribed you from our mailing list, you will no longer recieve mail from us.</p>
                <p>We're sorry to see you go. If you have any feedback, please <a href="https://discord.gg/4Rwr2pu2bW">let us know</a>.</p>
            `,
            null
        );
    } else {
        throw error(400, 'You are not subscribed');
    }

    return json({
        status: 200,
        message: 'Success -- you have been unsubscribed.'
    });
};