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

  if (!subscribed) {
    await MailingSubscriberModel.create({ email });

    await sendMail(
      [{ email }],
      null,
      "You're subscribed 🎉",
      "Thanks for subscribing to updates on Vocal!",
      `
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0b0b0b; font-family:Inter, Arial, sans-serif; color:#ffffff; margin:0; padding:0;">
              <tr>
                <td align="center" style="padding:32px 16px;">
                  <table width="100%" style="max-width:600px; background:#121212; border-radius:12px; overflow:hidden;">
                    <tr>
                      <td>
                        <img
                          src="https://vocal.wtf/images/ms-banner-success.png"
                          alt="You're subscribed"
                          style="width:100%; display:block;"
                        />
                      </td>
                    </tr>
          
                    <tr>
                      <td style="padding:24px 28px;">
                        <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">
                            You’re subscribed 🎉
                        </h1>
          
                        <p style="margin:0 0 16px; line-height:1.6; color:#d1d1d1;">
                            Thanks for subscribing to <strong>Vocal</strong>! We're happy to be on your mailing list. :)
                        </p>
          
                        <p style="margin:0 0 12px; line-height:1.6; color:#d1d1d1;">
                            You’ll hear from us when we have something worth sharing, including:
                        </p>
          
                        <ul style="margin:0 0 16px 18px; padding:0; color:#d1d1d1; line-height:1.6;">
                            <li>Product & feature releases</li>
                            <li>Important announcements</li>
                            <li>Occasional newsletters and updates</li>
                        </ul>
          
                        <p style="margin:0; line-height:1.6; color:#9a9a9a; font-size:14px;">
                            Email frequency may vary, but please feel free to let us know if you feel we mail you too often.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:16px 28px; border-top:1px solid #1f1f1f; font-size:13px; color:#777;">
                        <p style="margin:0;">
                          — The Vocal Team<br />
                          <a href="https://vocal.wtf" style="color:#777; text-decoration:none;">vocal.wtf</a> · contact us at support@vocal.wtf
                        </p>
                      </td>
                    </tr>
          
                  </table>
                </td>
              </tr>
            </table>
            `,
      null
    );

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `${email} has subscribed to the mailing list.`
      })
    });

    if (!res.ok) {
      throw error(502, "Failed to subscribe email");
    }
  } else {
    throw error(400, 'You are already subscribed');
  }

  return json({
    status: 200,
    message: 'Success -- you have been subscribed'
  });
};