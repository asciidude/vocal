import { json } from '@sveltejs/kit';
import { PostModel } from '$lib/models/Post.model';
import { ReplyModel } from 'src/lib/models/Reply.model.js';

export async function POST({ request }) {
    const body = await request.json();
    const { userId, page = 1, limit = 5, seenIds = [], postType = 'post' } = body;
    
    let result;

    if(postType === 'post') {
        const query = { 
            author: userId,
            _id: { $nin: seenIds }
        };
        
        const posts = await PostModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
        
        result = { posts: JSON.parse(JSON.stringify(posts)) };
    } else if(postType === 'reply') {
        const query = { 
            author: userId,
            _id: { $nin: seenIds }
        };
        
        const replies = await ReplyModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
        
        result = { replies: JSON.parse(JSON.stringify(replies)) };
    }
    
    return json(result);
}