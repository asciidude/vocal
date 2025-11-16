import { PostModel } from '$lib/models/Post.model';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/User.model';
import { LikeModel } from 'src/lib/models/Like.model';
import { ReplyModel } from 'src/lib/models/Reply.model';

const parseAndStringify = (data: any) => {
    return JSON.parse(JSON.stringify(data));
};

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const postId = params.slug;

        const post = await PostModel.findOne({ _id: postId });

        if(!post) {
            throw error(404, 'Not Found');
        }

        const postAuthor = await UserModel.findOne({ _id: post.author }).lean();

        const replies = await ReplyModel.find({ parent_post: postId })
            .sort({ createdAt: -1 })
            .lean();

        const repliesWithAuthors = await Promise.all(replies.map(async (reply) => {
            const replyAuthor = await UserModel.findOne({ _id: reply.author }).lean();
            return parseAndStringify({ ...reply, replyAuthor });
        }));

        const likes = await LikeModel.find({ parent_post: postId });
        
        return {
            post: parseAndStringify(post),
            author: parseAndStringify(postAuthor),
            likes: parseAndStringify(likes),
            replies: repliesWithAuthors
        };
    } catch (err) {
        console.error('Error loading home page:', err);
        throw error(500, 'Failed to load posts');
    }
};