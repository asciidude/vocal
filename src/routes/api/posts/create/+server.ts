import type { Cookies } from "@sveltejs/kit";

export const GET = async({ url, cookies }: { url: URL, cookies: Cookies }) => {
    // Check if user is logged in
    // If not, cancel the request and return 401 Unauthorized
    // If they are, continue with handling the request and create the post
    // Once created, return 200 OK and update client homepage with post
    // If failed (try-catch), return 500 Internal Server Error
}

export enum PostType {
    Reply = 0,
    Post = 1
}