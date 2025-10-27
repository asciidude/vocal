import { JWT_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { connect } from '$lib/utils/Database.utils';
import { UserModel } from '$lib/models/User.model';
import jwt from 'jsonwebtoken';

await connect();

export const handleError = ({ error }: { error: any }) => {
    console.error('SvelteKit error:', error);
    return { message: 'Something went wrong' };
};

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const token = event.cookies.get('session');
        
        if(token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string };
                const user = await UserModel.findOne({ discordId: decoded.id });
    
                if(user) {
                    event.locals.user = JSON.stringify(user);
                }
            } catch(err) {
                console.error(`JWT Verification Failure: ${err}`);
                event.cookies.delete('session', { path: '/' });
            }
        }
    
        const response = await resolve(event);
        return response;
    } catch(err) {
        handleError({ error: err });
        return new Response('Internal Server Error', { status: 500 });
    }
}