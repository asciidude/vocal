import { JWT_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { connect } from '$lib/utils/Database.utils';
import { UserModel } from '$lib/models/User.model';
import jwt from 'jsonwebtoken';

await connect();

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    return response;
}