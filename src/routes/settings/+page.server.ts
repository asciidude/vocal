import type { UserType } from 'src/lib/types/User.type';

/**
 * TODO: Link settings page to backend
 */

export const load = async ({ params, locals }) => {
    const user = locals.user as UserType | null;
    return { user }
}