import { redirect } from '@sveltejs/kit';

export function load({ route, locals }) {
    const user = locals.user ? structuredClone(JSON.parse(locals.user)) : null;
    
    const restrictedUrls = {
        authenticated: {
            routes: [ '/' ]
        },
        unauthenticated: {
            except_routes: [ '/', '/tos', '/privacy' ]
        }
    }

    if(user) {
        if(restrictedUrls.authenticated.routes.includes(route.id || '/')) {
            throw redirect(303, '/home');
        }
    } else {
        const isExcepted = restrictedUrls.unauthenticated.except_routes.includes(route.id || '/');

        if(!isExcepted) {
            throw redirect(303, '/');
        }
    }

    return { user };
}