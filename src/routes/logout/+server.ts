export function GET({ cookies }) {
    cookies.delete('session', { path: '/' });
    return new Response(null, { status: 302, headers: { Location: '/' } });
}