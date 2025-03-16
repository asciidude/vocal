import { PostModel } from '$lib/models/Post.model';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/User.model';
import mongoose from 'mongoose';
import type { PostType } from '$lib/types/Post.type';
import type { UserType } from '$lib/types/User.types';
import { LikeModel } from 'src/lib/models/Like.model';
import { ReplyModel } from 'src/lib/models/Reply.model';

const parseAndStringify = (data: any) => {
    return JSON.parse(JSON.stringify(data));
};

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .limit(30)
            .lean();
            
        if (!posts) {
            return {
                posts: [],
                likesCountMap: {},
                repliesCountMap: {}
            };
        }
        
        const postsWithAuthors = await Promise.all(posts.map(async (post) => {
            const author = await UserModel.findOne({ _id: post.author }).lean();
            return { ...post, author };
        }));
        
        let postLikes = [];
        const likePromises = posts.map(post => LikeModel.find({ parent_post: post._id }));
        postLikes = await Promise.all(likePromises);
        postLikes = postLikes.flat();

        let postReplies = [];
        const replyPromises = posts.map(post => ReplyModel.find({ parent_post: post._id }));
        postReplies = await Promise.all(replyPromises);
        postReplies = postReplies.flat();
        
        return {
            posts: parseAndStringify(postsWithAuthors),
            likes: parseAndStringify(postLikes),
            replies: parseAndStringify(postReplies)
        };
    } catch (err) {
        console.error('Error loading home page:', err);
        throw error(500, 'Failed to load posts');
    }
};

export const actions = {
    default: async ({ request, locals }) => {
        const currentUser = locals.user as UserType | null;
        
        if (!currentUser) {
            throw error(401, 'You must be logged in to create a post');
        }
        
        const formData = await request.formData();
        const content = formData.get('content')?.toString();
        
        if (!content || content.trim() === '') {
            throw error(400, 'Post content cannot be empty');
        }
        
        try {
            const newPost = new PostModel({
                author: new mongoose.Types.ObjectId(currentUser._id),
                content,
                attachments: []
            });
            
            await newPost.save();
            
            return { success: true };
        } catch (err) {
            console.error('Error creating post:', err);
            throw error(500, 'Failed to create post');
        }
    }
};
