import { error, json, type RequestHandler } from "@sveltejs/kit";
import { isValidObjectId } from "mongoose";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";

export const PATCH: RequestHandler = async({ request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    const formData = await request.formData();
    const posterId = formData.get('posterId');

    if(!user || user._id !== posterId) {
        throw error(401, 'Unauthorized');
    }

    try {
        const postType = formData.get('postType');
        const postId = formData.get('postId');
        const content = formData.get('content');

        if(!content) {
            throw error(422, 'Unprocessable Content');
        }

        if(postType === 'reply') {
            const post = await ReplyModel.updateOne(
                { _id: postId },
                { content: content }
            );
    
            return json({
                status: 200,
                message: 'Success',
                user, post
            });
        } else if(postType === 'post') {
            const post = await PostModel.updateOne(
                { _id: postId },
                { content: content }
            );
    
            return json({
                status: 200,
                message: 'Success',
                user, post
            });
        } else {
            throw error(401, 'Invalid Request')
        }
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}