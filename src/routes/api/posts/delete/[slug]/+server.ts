import { json, type RequestHandler } from "@sveltejs/kit";
import fs from 'fs';
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import { LikeModel } from "src/lib/models/Like.model";

export const POST: RequestHandler = async ({ params, request, locals }) => {
    try {
        const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;
        if (!user) {
            return json({ success: false, message: 'You are not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const posterId = body.posterId;
        const postId = params.slug;

        if (!postId) {
            return json({ success: false, message: 'Post not found' }, { status: 422 });
        }

        if (user._id !== posterId) {
            return json({ success: false, message: 'You are not authorized to delete this post' }, { status: 401 });
        }

        const postType = body.postType;
        if (postType === 'reply') {
            await ReplyModel.deleteOne({ _id: postId });
        } else if (postType === 'post') {
            await PostModel.deleteOne({ _id: postId });
        } else {
            return json({ success: false, message: 'Bad request: invalid postType' }, { status: 400 });
        }

        await ReplyModel.deleteMany({ parent_post: postId });
        await LikeModel.deleteMany({ parent_post: postId });

        const postMediaDir = `static/posts/${postId}`;
        if (fs.existsSync(postMediaDir)) {
            fs.rmSync(postMediaDir, { recursive: true, force: true });
        }

        return json({ success: true, message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        return json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
};