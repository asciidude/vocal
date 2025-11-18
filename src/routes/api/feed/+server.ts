import { error, json, type RequestHandler } from '@sveltejs/kit';
import { FeedAlgorithm } from '$lib/utils/Feed.util';

export const GET: RequestHandler = async ({ url, locals }) => {
    const user = locals.user;

    if (!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const searchPage = url.searchParams.get('page');
        const searchLimit = url.searchParams.get('limit');
        const searchMinSim = url.searchParams.get('minSimilarity');

        if(!searchPage || !searchLimit || !searchMinSim) {
            throw error(400, 'Bad Request');
        }

        const page = parseInt(searchPage) || 1;
        let limit = parseInt(searchLimit) || 15;
        const minSimilarity = parseFloat(searchMinSim) || 0.1;
        if(limit > 15) limit = 15;

        const skip = (page - 1) * limit;
        
        const feed = await FeedAlgorithm.generateFeed(String(user._id), {
            limit,
            minSimilarity,
            skip
        });

        return json({
            status: 200,
            message: 'Success',
            feed,
            count: feed.length,
            page,
            hasMore: feed.length === limit
        });
    } catch (err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}