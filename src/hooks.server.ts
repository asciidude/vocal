import { JWT_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { connect } from '$lib/utils/Database.utils';
import { UserModel } from '$lib/models/User.model';
import jwt from 'jsonwebtoken';

await connect();

/**
 * Set restricted routes for unauthenticated and authenticated
 * users. 
 */
const restrictedRoutes = {
    authenticated: {
        only: false, // Make authenticated/unauthenticated users only able to visit listed routes if enabled
        routes: [
            '/',
            '/api/auth/discord',
            '/api/auth/callback',
        ]
    },
    unauthenticated: {
        only: true,
        routes: [
            '/',
            '/api/auth/discord',
            '/tos', '/privacy'
        ]
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session');
    let authUser = null;

    if(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string };
            const user = await UserModel.findOne({ discordId: decoded.id });

            if(user) {
                event.locals.user = JSON.stringify(user);
                authUser = user;
            }
        } catch(err) {
            console.error(`JWT Verification Failure: ${err}`);
            event.cookies.delete('session', { path: '/' });
        }
    }

    const restrictedAuthRoutes = restrictedRoutes.authenticated.routes;
    const restrictedUnauthRoutes = restrictedRoutes.unauthenticated.routes;

    /*
    if (authUser) {
        console.log('Authenticated');
        if (restrictedRoutes.authenticated.only) {
            if (!restrictedAuthRoutes.includes(event.url.pathname)) {
                console.log('Authenticated - redirect');
                throw redirect(302, '/posts'); 
            }
        } else {
            if (restrictedAuthRoutes.includes(event.url.pathname)) {
                console.log('Authenticated - redirect');
                throw redirect(302, '/posts');
            }
        }
    } else {
        console.log('Unauthenticated');
        if (restrictedRoutes.unauthenticated.only) {
            if (!restrictedUnauthRoutes.includes(event.url.pathname)) {
                console.log('Unauthenticated - redirect');
                throw redirect(302, '/');
            }
        } else {
            if (restrictedUnauthRoutes.includes(event.url.pathname)) {
                console.log('Unauthenticated - redirect');
                throw redirect(302, '/');
            }
        }
    }
    */

    const response = await resolve(event);
    return response;
}