import { error, json, type RequestHandler } from "@sveltejs/kit";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";

export const POST: RequestHandler = async({ params, request, locals }) => {
    /** 
     * TODO: Add attachment removal thru edits
    */

    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    const formData = await request.formData();
    const posterId = formData.get('posterId');
    const content = formData.get('content');
    const attachments = formData.get('attachments');
    const postId = params.slug;

    if(!postId) {
        throw error(422, 'Unprocessable Entity');
    }

    if(!user || user._id !== posterId) {
        throw error(401, 'Unauthorized');
    }

    try {
        const postType = formData.get('postType');

        if(!postId) {
            throw error(422, 'Unprocessable Content');
        }

        if(postType === 'reply') {
            await ReplyModel.updateOne({ _id: postId, content: content });

            return json({
                status: 200,
                message: 'Success'
            });
        } else if(postType === 'post') {
            await PostModel.updateOne({ _id: postId, content: content });
    
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