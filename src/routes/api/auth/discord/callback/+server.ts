import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, NODE_ENV, PORT, JWT_SECRET } from "$env/static/private";
import { UserModel } from "$lib/models/User.model";
import { UserRoles, type UserType } from "$lib/types/User.types";
import { error, redirect, type Cookies } from "@sveltejs/kit";
import jwt from 'jsonwebtoken';

export const GET = async({ url, cookies }: { url: URL, cookies: Cookies }) => {
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
            redirect_uri: NODE_ENV === 'production' ? DISCORD_REDIRECT_URI : `http://localhost:${PORT}/api/auth/discord/callback`
        })
    });

    const tokenData = await tokenResponse.json();

    if(!tokenData.access_token) throw error(400, 'Unable to obtain access token');

    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token} ` }
    });

    const userData = await userResponse.json();

    const user = await UserModel.findOne({ discordId: userData.id });

    await UserModel.updateOne(
        { discordId: userData.id },
        {
            discordId: userData.id,
            avatarUrl: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=512` : 'https://cdn.discordapp.com/embed/avatars/1.png?size=4096',
            bannerUrl: userData.banner ? `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.png?size=1024` : 'none',
            username: userData.username,
            displayName: userData.global_name,
            bio: user?.bio || '',
            roles: user?.roles || []
        } as UserType,
        { new: true, upsert: true }
    );

    // BETA ONLY FEATURE //
    if(!user!.roles.includes(UserRoles.Beta)) throw error(403, 'Your account does not have beta access, please apply on our Discord.');
    // BETA ONLY FEATURE //

    const jwtToken = jwt.sign({
        id: userData.id,
        username: userData.username
    }, JWT_SECRET, { expiresIn: '7d' });

    cookies.set('session', jwtToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: ((60 * 60) * 24) * 7 // 1w
    });

    return redirect(302, '/home');
}