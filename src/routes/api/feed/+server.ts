import { error, json, type RequestHandler } from '@sveltejs/kit';
import { FeedAlgorithm } from '$lib/utils/Feed.util';

export const POST: RequestHandler = async ({ request, locals }) => {
    const user = locals.user;

    if(!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const formData = await request.formData();
        const limit = parseInt(String(formData.get('limit'))) || 15;
        const minSimilarity = parseFloat(String(formData.get('minSimiliarty'))) || 0.1;
        
        const feed = await FeedAlgorithm.generateFeed(String(user._id), {
            limit, minSimilarity
        });

        return json({
            status: 200,
            message: 'Success',
            feed,
            count: feed.length
        });
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}