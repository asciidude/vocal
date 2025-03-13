export function load({ locals }) {
    return { user: locals.user ? structuredClone(JSON.parse(locals.user)) : null };
}