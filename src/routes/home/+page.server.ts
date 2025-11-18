import { PostModel } from '$lib/models/Post.model';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/User.model';
import mongoose from 'mongoose';
import type { UserType } from '$lib/types/User.types';
import { FeedAlgorithm } from '$lib/utils/Feed.util';
import { LikeModel } from 'src/lib/models/Like.model';
import { ReplyModel } from 'src/lib/models/Reply.model';

const parseAndStringify = (data: any) => {
    return JSON.parse(JSON.stringify(data));
};

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const user = locals.user;
        if (!user) throw error(401, 'Unauthorized');
        
        let posts = await FeedAlgorithm.generateFeed(String(user._id), {
            limit: 5,
            minSimilarity: 0.1
        });
        
        const postIds = posts.map(p => p._id);
        
        const [postLikes, postReplies] = await Promise.all([
            LikeModel.find({ parent_post: { $in: postIds } }).lean(),
            ReplyModel.find({ parent_post: { $in: postIds } }).lean()
        ]);
        
        return {
            posts: parseAndStringify(posts),
            likes: parseAndStringify(postLikes),
            replies: parseAndStringify(postReplies),
            user: user || null
        };
        
    } catch (err) {
        console.error('Error loading home page:', err);
        throw error(500, 'Failed to load posts');
    }
};