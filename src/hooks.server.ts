import { JWT_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { connect } from '$lib/utils/Database.utils';
import { UserModel } from '$lib/models/User.model';
import jwt from 'jsonwebtoken';

await connect();

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session');

    if(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string };
            const user = await UserModel.findOne({ discordId: decoded.id });

            if(user) event.locals.user = JSON.stringify(user);
        } catch(err) {
            console.error(`JWT Verification Failure: ${err}`);
            event.cookies.delete('session', { path: '/' });
        }
    }

    const response = await resolve(event);
    return response;
}