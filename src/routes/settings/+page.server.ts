import type { UserType } from '$lib/types/User.types';

export const load = async ({ params, locals }) => {
    const user = locals.user as UserType | null;
    return { user }
}