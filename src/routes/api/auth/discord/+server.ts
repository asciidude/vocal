import { dev } from "$app/environment";
import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI, PORT } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const GET = () => {
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
    discordAuthUrl.searchParams.set('client_id', DISCORD_CLIENT_ID);
    discordAuthUrl.searchParams.set('redirect_uri',
        dev ?
        encodeURI(`http://localhost:${PORT}/api/auth/discord/callback`)
        : encodeURI(DISCORD_REDIRECT_URI)
    );
    discordAuthUrl.searchParams.set('response_type', 'code');
    discordAuthUrl.searchParams.set('scope', 'identify');

    throw redirect(302, discordAuthUrl.toString());
}