import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return json({ success: false, message: 'Missing userId' }, { status: 400 });
        }

        if (!Boolean(env.VERIFY_AGE)) {
            return json({ success: false, message: 'Age verification disabled.' }, { status: 400 });
        }

        const secretKey = dev
            ? env.PERSONA_SECRET_SANDBOX
            : env.PERSONA_SECRET_PRODUCTION;

        if (!secretKey || !env.PERSONA_TEMPLATE_ID) {
            return json({ success: false, message: 'Missing Persona config' }, { status: 500 });
        }

        const response = await fetch('https://api.withpersona.com/inquiries', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template_id: env.PERSONA_TEMPLATE_ID,
                reference_id: userId,
                environment: dev ? 'sandbox' : 'production'
            })
        });

        const text = await response.text();

        if (!response.ok) {
            console.error('Persona API error:', text);
            return json({ success: false, message: 'Persona API returned an error' }, { status: response.status });
        }

        const data = JSON.parse(text);

        return json({ 
            success: true, 
            inquiryId: data.data.id,
            referenceId: data.data.attributes.reference_id
        });

    } catch (err) {
        console.error('Persona server error:', err);
        return json({ success: false, message: 'Server error' }, { status: 500 });
    }
};