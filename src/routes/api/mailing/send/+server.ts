import { error, json } from "@sveltejs/kit";
import { UserRoles } from "$lib/types/User.types";
import { MailingSubscriberModel } from "$lib/models/MailingSubscriber.model";
import { sendMail } from "$lib/utils/Mailer.util";

export const POST = async ({ request, locals }) => {
    if (!locals.user || !locals.user.roles.includes(UserRoles.SuperAdmin)) {
        throw error(403, "Unauthorized");
    }

    const form = await request.formData();
    const subject = String(form.get("subject") || "");
    const body = String(form.get("body") || "");

    if (!subject || !body) {
      return json({ success: false, message: "Subject and body required" }, { status: 400 });
    }

    let bannerHtml = "";
    const bannerFile = form.get("banner") as File | null;
    if (bannerFile && bannerFile.size > 0) {
        const bannerBase64 = Buffer.from(await bannerFile.arrayBuffer()).toString("base64");
        const mime = bannerFile.type;
        bannerHtml = `
      <tr>
        <td align="center" style="padding:0;">
          <img src="data:${mime};base64,${bannerBase64}" 
               style="width:100%; height:100px; object-fit:cover; display:block; border-radius:8px;" 
               alt="banner"/>
        </td>
      </tr>`;
    }

    const subscribers = await MailingSubscriberModel.find({}, { email: 1, _id: 0 });
    if (!subscribers.length) {
        return json({ success: false, message: "No subscribers found" }, { status: 404 });
    }
    const emails = subscribers.map(s => ({ email: s.email }));

    const html = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0b0b0b; font-family:Inter, Arial, sans-serif; color:#ffffff; margin:0; padding:0;">
      <tbody>
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table width="100%" style="max-width:600px; background:#121212; border-radius:12px; overflow:hidden;">
              <tbody>
                ${bannerHtml}
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0; line-height:1.7; color:#d1d1d1; white-space:pre-wrap;">${body}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 28px; border-top:1px solid #1f1f1f; font-size:13px; color:#777;">
                    <p style="margin:0;">— The Vocal Team<br />
                      <a href="https://vocal.wtf" style="color:#777; text-decoration:none;">vocal.wtf</a> · support@vocal.wtf
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  `;

    try {
        const results = await sendMail(emails, null, subject, body, html, null);
        const failedBatches = results.filter(r => !r.success);

        if (failedBatches.length) {
            return json({
                success: false,
                message: `Failed ${failedBatches.length} batch(es)`,
                batches: failedBatches
            }, { status: 500 });
        }

        return json({ success: true, sent: emails.length });
    } catch (err: any) {
        console.error("Mailing error:", err);
        return json({ success: false, message: err.message || "Unknown error" }, { status: 500 });
    }
};