export interface EmailType {
  email: string;
  name?: string;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function sendMail(
  emails: EmailType[],
  cc_email: string | null,
  subject: string,
  text: string,
  html: string,
  attachments: { filename: string; content: string }[] | null
) {
  if (!process.env.SMTP_API_KEY) {
    throw new Error("SMTP_API_KEY not set");
  }

  const maxRecipients = cc_email ? 99 : 100;
  const batches = chunk(emails, maxRecipients);
  const results: any[] = [];

  const htmlWithUnsubscribe = `${html}<br><p>If you wish to unsubscribe, click <a href="https://vocal.wtf/mailing">here</a>.</p>`;

  for (const batch of batches) {
    if (!batch.length) continue;

    const payload: any = {
      api_key: process.env.SMTP_API_KEY,
      sender: "Vocal <noreply@vocal.wtf>",
      from: "Vocal <noreply@vocal.wtf>",
      to: ["noreply@vocal.wtf"], // required dummy 'to'
      subject,
      text_body: text,
      html_body: htmlWithUnsubscribe,
      bcc: batch.map((r) => r.email),
    };

    if (cc_email) payload.cc = [cc_email];
    if (attachments) payload.attachments = attachments;

    try {
      const res = await fetch("https://api.smtp2go.com/v3/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      results.push(data);
    } catch (err: any) {
      console.error("SMTP2GO send error:", err.message);
      results.push({ error: err.message });
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  return results;
}
