export function load({ locals, params }) {
    return { currentUser: locals.user ? structuredClone(locals.user) : null };
}