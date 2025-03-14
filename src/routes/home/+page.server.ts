import { PostModel } from '$lib/models/Post.model';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/User.model';
import mongoose from 'mongoose';
import type { PostType } from '$lib/types/Post.type';
import type { UserType } from '$lib/types/User.types';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const currentUser = locals.user as UserType | null;

        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .limit(30)
            .lean();
            
        if (!posts) {
            return {
                posts: [],
                usersMap: {},
                likesCountMap: {},
                repliesCountMap: {},
                currentUser
            };
        }
        
        const authorIds = [...new Set(posts.map(post => post.author))];
        
        const users = await UserModel.find({
            _id: { $in: authorIds }
        }).lean();
        
        const usersMap: Record<string, UserType> = {};
        users.forEach(user => {
            usersMap[user._id.toString()] = user;
        });
        
        const likesCountMap: Record<string, number> = {};
        const repliesCountMap: Record<string, number> = {};
        
        for (const post of posts) {
            const postId = post._id.toString();
            likesCountMap[postId] = Math.floor(Math.random() * 50);
            repliesCountMap[postId] = Math.floor(Math.random() * 20);
        }
        
        return {
            posts,
            usersMap,
            likesCountMap,
            repliesCountMap,
            currentUser
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