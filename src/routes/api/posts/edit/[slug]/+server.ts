import { error, json, type RequestHandler } from "@sveltejs/kit";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";

export const POST: RequestHandler = async({ params, request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    const body = await request.json();
    const posterId = body.posterId;
    const content = body.content;
    const postId = params.slug;

    if(!postId) {
        throw error(422, 'Post ID not provided');
    }

    if(!user || user._id !== posterId) {
        throw error(401, 'You are not authorized to edit this post');
    }

    try {
        const postType = body.postType;

        if(postType === 'reply') {
            await ReplyModel.updateOne({ _id: postId }, { content: content });

            return json({
                status: 200,
                message: 'Success'
            });
        } else if(postType === 'post') {
            await PostModel.updateOne({ _id: postId }, { content: content });
    
            return json({
                status: 200,
                message: 'Success'
            });
        } else {
            throw error(401, 'Invalid Request')
        }
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}