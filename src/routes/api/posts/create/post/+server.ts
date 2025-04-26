import { error, json, type RequestHandler } from "@sveltejs/kit";
import { PostModel } from "src/lib/models/Post.model";

export const POST: RequestHandler = async({ request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    if(!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const formData = await request.formData();
        const content = formData.get('content');

        if(!content) {
            throw error(422, 'Unprocessable Content');
        }
        
        const post = await PostModel.create({
            author: user._id,
            content: content,
            attachments: [] // later
        });

        return json({
            status: 200,
            message: 'Success',
            user, post
        });
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}