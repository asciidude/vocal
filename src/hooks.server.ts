import { JWT_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { connect } from '$lib/utils/Database.utils';
import { UserModel } from '$lib/models/User.model';
import jwt from 'jsonwebtoken';
import type { UserType } from './lib/types/User.types';
import { initializeTfIdf } from './lib/utils/TF-IDF.util';

await connect();
await initializeTfIdf().catch(console.error);

export const handleError = ({ error }: { error: any }) => {
    console.error('SvelteKit error:', error);
    return { message: 'Something went wrong' };
};

export const handle: Handle = async ({ event, resolve }) => {
    let user: UserType | null = null;

    const token = event.cookies.get('session');
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
            const userDoc = await UserModel.findOne({ "authProviders.id": decoded.id }).lean();

            if (userDoc) {
                user = {
                    _id: userDoc._id.toString(),
                    username: userDoc.username,
                    displayName: userDoc.displayName ?? null,
                    avatarUrl: userDoc.avatarUrl ?? "",
                    bannerUrl: userDoc.bannerUrl ?? "none",
                    bio: userDoc.bio ?? "",
                    roles: userDoc.roles ?? [],
                    authProviders: userDoc.authProviders ?? [],
                    userInterestVectors: userDoc.userInterestVectors ?? {},
                    followedHashtags: userDoc.followedHashtags ?? [],
                    excludedKeywords: userDoc.excludedKeywords ?? []
                };
            }
        } catch (err) {
            console.error(`JWT Verification Failure: ${err}`);
            event.cookies.delete('session', { path: '/' });
        }
    }

    event.locals.user = user;

    return await resolve(event);
};