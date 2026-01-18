import type { UserType } from '$lib/types/User.types';

/**
 * TODO: Link settings page to backend
 */

export const load = async ({ params, locals }) => {
    const user = locals.user as UserType | null;
    return { user }
}