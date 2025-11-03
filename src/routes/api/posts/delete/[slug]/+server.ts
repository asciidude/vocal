import { error, json, type RequestHandler } from "@sveltejs/kit";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";

export const POST: RequestHandler = async({ params, request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    const formData = await request.formData();
    const posterId = formData.get('posterId');
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
            await ReplyModel.deleteOne({ _id: postId });

            return json({
                status: 200,
                message: 'Success'
            });
        } else if(postType === 'post') {
            await PostModel.deleteOne({ _id: postId });
    
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