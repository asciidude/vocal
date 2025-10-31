export function load({ locals, params }) {
    return { currentUser: locals.user ? structuredClone(JSON.parse(locals.user)) : null };
}