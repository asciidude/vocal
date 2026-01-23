import { json, type RequestHandler } from "@sveltejs/kit";
import { FollowModel } from "src/lib/models/Follow.model";
import { UserModel } from "src/lib/models/User.model";

export const POST: RequestHandler = async ({ params, locals }) => {
    try {
        const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

        if (!user) {
            return json({ success: false, message: 'You are not authenticated' }, { status: 401 });
        }

        const userId = params.slug;
        const followingUser = await UserModel.exists({ _id: userId });

        if (!userId || !followingUser || user._id === userId) {
            return json({ success: false, message: 'Invalid user or cannot follow yourself' }, { status: 422 });
        }

        const existingFollow = await FollowModel.exists({ followerId: user._id, followingId: userId });

        if (!existingFollow) {
            await FollowModel.create({ followerId: user._id, followingId: userId });
            return json({ success: true, newlyFollowed: true, message: 'Successfully followed' });
        } else {
            await FollowModel.deleteOne({ followerId: user._id, followingId: userId });
            return json({ success: true, newlyFollowed: false, message: 'Successfully unfollowed' });
        }

    } catch (err) {
        console.error(err);
        return json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
};
