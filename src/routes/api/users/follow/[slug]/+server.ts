import { error, json, type RequestHandler } from "@sveltejs/kit";
import { FollowModel } from "src/lib/models/Follow.model";
import { UserModel } from "src/lib/models/User.model";

export const POST: RequestHandler = async({ params, request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    const userId = params.slug;
    const followingUser = await UserModel.exists({ _id: userId });

    if(
        !userId
        || !followingUser
        || user._id == userId
    ) {
        throw error(422, 'Unprocessable Entity');
    }

    if(!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const following = await FollowModel.exists({ followerId: user._id, followingId: userId });

        if(!following) {
            await FollowModel.create({
                followerId: user._id,
                followingId: userId
            });
            
            return json({
                status: 200,
                newlyFollowed: true,
                message: 'Success'
            });
        } else {
            await FollowModel.deleteOne({
                followerId: user._id,
                followingId: userId
            });

            return json({
                status: 200,
                newlyFollowed: false,
                message: 'Success'
            });
        }
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}