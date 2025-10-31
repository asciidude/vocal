export function load({ locals, params }) {
    return { user: locals.user ? structuredClone(JSON.parse(locals.user)) : null };
}