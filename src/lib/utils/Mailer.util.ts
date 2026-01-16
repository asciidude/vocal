import * as nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER!,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME!,
        pass: process.env.SMTP_TOKEN!
    }
});

export async function sendMail(email: string, subject: string, text: string, html: string) {
    return transporter.sendMail({
        from: `"Vocal" <noreply@vocal.wtf>`,
        to: email,
        subject,
        text,
        html
    });
}