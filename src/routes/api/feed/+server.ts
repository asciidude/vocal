import { error, json, type RequestHandler } from '@sveltejs/kit';
import { FeedAlgorithm } from '$lib/utils/Feed.util';

export const POST: RequestHandler = async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401, 'Unauthorized');

    try {
        const body = await request.json();
        const { page = 1, limit = 15, minSimilarity = 0.1, seenIds = [] } = body;

        const feed = await FeedAlgorithm.generateFeed(String(user._id), {
            limit,
            minSimilarity,
            seenIds
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