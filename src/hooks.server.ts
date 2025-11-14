import { JWT_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { connect } from '$lib/utils/Database.utils';
import { UserModel } from '$lib/models/User.model';
import jwt from 'jsonwebtoken';
import type { UserType } from './lib/types/User.types';

await connect();

export const handleError = ({ error }: { error: any }) => {
    console.error('SvelteKit error:', error);
    return { message: 'Something went wrong' };
};

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const token = event.cookies.get('session');

        event.locals.user = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as {
                    id: string;
                    username: string;
                };

                const user_d = await UserModel.findOne({
                    'authProviders.id': decoded.id
                }).lean();

                let user: UserType | null = null;

                if (user_d) {
                    user = {
                        _id: user_d._id.toString(),
                        username: user_d.username,
                        displayName: user_d.displayName ?? null,
                        avatarUrl: user_d.avatarUrl ?? "",
                        bannerUrl: user_d.bannerUrl ?? "none",
                        bio: user_d.bio ?? "",
                        roles: user_d.roles ?? [],
                        authProviders: user_d.authProviders ?? []
                    };
                }

                event.locals.user = user;
            } catch (err) {
                console.error(`JWT Verification Failure: ${err}`);
                event.cookies.delete('session', { path: '/' });
            }
        }

        return await resolve(event);
    } catch (err) {
        handleError({ error: err });
        return new Response('Internal Server Error', { status: 500 });
    }
};