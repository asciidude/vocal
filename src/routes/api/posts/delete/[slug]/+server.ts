import { error, json, type RequestHandler } from "@sveltejs/kit";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import fs from 'fs';
import { LikeModel } from "src/lib/models/Like.model";

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

        if(postType === 'reply') {
            await ReplyModel.deleteOne({ _id: postId });
        } else if(postType === 'post') {
            await PostModel.deleteOne({ _id: postId });
        } else if(postType !== 'reply' && postType !== 'post') {
            throw error(400, 'Bad Request');
        }

        await ReplyModel.deleteMany({ parent_post: postId });
        await LikeModel.deleteMany({ parent_post: postId });

        const postMedia = `static/posts/${postId}`;
        if(fs.existsSync(postMedia)) {
            fs.rmSync(postMedia, { recursive: true });
        }

        return json({
            status: 200,
            message: 'Success'
        });
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}