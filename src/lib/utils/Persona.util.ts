export async function createInquiry(userId: string) {
    const res = await fetch('https://api.withpersona.com/inquiries', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.PERSONA_SECRET}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            template_id: process.env.PERSONA_TEMPLATE_ID,
            reference_id: userId
        })
    });

    return res.json();
}