// src/routes/api/account/verify/persona/complete/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { userId, inquiryId } = await request.json();

        if (!userId || !inquiryId) {
            return json({ success: false, message: 'Missing userId or inquiryId' }, { status: 400 });
        }

        // update db

        return json({ success: true });

    } catch (err) {
        console.error('Complete verification error:', err);
        return json({ success: false, message: 'Server error' }, { status: 500 });
    }
};