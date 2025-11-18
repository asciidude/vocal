import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, NODE_ENV, PORT, JWT_SECRET } from "$env/static/private";
import { UserModel } from "$lib/models/User.model";
import { UserRoles } from "$lib/types/User.types";
import { error, redirect, type Cookies } from "@sveltejs/kit";
import jwt from 'jsonwebtoken';
import { getUniqueUsername } from "src/lib/utils/GetUniqueUsername";

export const GET = async (event) => {
    const { url, cookies, locals } = event;

    const code = url.searchParams.get('code');
    if (!code) throw error(400, 'No code provided');

    console.log('[OAuth] Starting Discord callback with code');

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: NODE_ENV === 'production'
                ? DISCORD_REDIRECT_URI
                : `http://localhost:${PORT}/api/auth/discord/callback`
        })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
        throw error(400, 'Unable to obtain access token');
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!userResponse.ok) {
        throw error(500, 'Failed to fetch user data from Discord');
    }

    const userData = await userResponse.json();
    console.log('[OAuth] Discord user data received');

    let jwtToken;
    const userWithDiscord = await UserModel.findOne({ 'authProviders.id': userData.id });

    if (userWithDiscord) {
        const discordProvider = userWithDiscord.authProviders.find(p => p.platform === 'discord');
        if (discordProvider) {
            discordProvider.accessToken = tokenData.access_token;
            await userWithDiscord.save();
        }

        if (!userWithDiscord.roles.includes(UserRoles.Beta)) {
            throw error(403, 'No beta access');
        }

        jwtToken = jwt.sign({
            id: userData.id,
            username: userWithDiscord.username
        }, JWT_SECRET, { expiresIn: '7d' });

    } else if (locals.user) {
        const currentUser = await UserModel.findById(locals.user._id);
        if (!currentUser) throw error(500, "User not found");
        
        currentUser.authProviders.push({
            platform: "discord", 
            id: userData.id, 
            accessToken: tokenData.access_token 
        });
        await currentUser.save();

        jwtToken = jwt.sign({
            id: userData.id,
            username: currentUser.username
        }, JWT_SECRET, { expiresIn: '7d' });

    } else {
        const username = await getUniqueUsername(userData.username);

        const newUser = await UserModel.create({
            username,
            displayName: userData.global_name,
            avatarUrl: userData.avatar
                ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=512`
                : "https://cdn.discordapp.com/embed/avatars/1.png?size=4096",
            bannerUrl: userData.banner
                ? `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.png?size=1024`
                : "none",
            authProviders: [
                { platform: "discord", id: userData.id, accessToken: tokenData.access_token }
            ],
            bio: "",
            roles: [UserRoles.Beta],
            userInterestVectors: {},
            followedHashtags: [],
            excludedKeywords: []
        });

        if (!newUser.roles.includes(UserRoles.Beta)) {
            throw error(403, 'No beta access');
        }

        jwtToken = jwt.sign({
            id: userData.id,
            username: newUser.username
        }, JWT_SECRET, { expiresIn: '7d' });
    }

    cookies.set('session', jwtToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax'
    });

    throw redirect(302, '/home');
};