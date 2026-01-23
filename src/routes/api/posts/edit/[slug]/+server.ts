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
        return json({ success: false, message: 'Post ID not provided' }, { status: 422 });
    }

    if(!user || user._id !== posterId) {
        return json({ success: false, message: 'You are not authorized to edit this post' }, { status: 401 });
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
            return json({ success: false, message: 'Post type is invalid' }, { status: 400 });
        }
    } catch(err) {
        console.error(err);
        return json({ success: false, message: 'An error occured' }, { status: 500 });
    }
}