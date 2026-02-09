import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { inquiryId } = await request.json();

        if (!inquiryId) {
            return json({ success: false, message: 'Missing inquiryId' }, { status: 400 });
        }

        const secretKey = dev
            ? env.PERSONA_SECRET_SANDBOX
            : env.PERSONA_SECRET_PRODUCTION;

        if (!secretKey) {
            return json({ success: false, message: 'Missing Persona config' }, { status: 500 });
        }

        const response = await fetch(`https://api.withpersona.com/inquiries/${inquiryId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        const text = await response.text();

        if (!response.ok) {
            console.error('Persona API error:', text);
            return json({ success: false, message: 'Persona API returned an error' }, { status: response.status });
        }

        const data = JSON.parse(text);
        const status = data.data.attributes.status;
        const referenceId = data.data.attributes.reference_id;

        return json({ 
            success: true, 
            status,
            referenceId
        });

    } catch (err) {
        console.error('Persona status check error:', err);
        return json({ success: false, message: 'Server error' }, { status: 500 });
    }
};