export function load({ locals, params }) {
    return { user: locals.user ? structuredClone(locals.user) : null };
}