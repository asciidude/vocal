import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, NODE_ENV, PORT } from "$env/static/private";
import { error, json } from "@sveltejs/kit";

export const GET = async({ url }: { url: URL }) => {
    const code = url.searchParams.get('code');
    if(!code) throw error(400, 'No code provided');

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: NODE_ENV === 'production' ? DISCORD_REDIRECT_URI : `https://localhost:${PORT}/api/auth/callback`
        })
    });

    const tokenData = await tokenResponse.json();
    if(!tokenData.access_token) throw error(400, 'Unable to obtain access token');

    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token} ` }
    });

    const userData = await userResponse.json();

    return json({ data: JSON.stringify(userData) });
}