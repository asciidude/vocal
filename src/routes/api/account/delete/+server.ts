import { error, json, type RequestHandler } from '@sveltejs/kit';
import { FollowModel } from '$lib/models/Follow.model';
import { LikeModel } from '$lib/models/Like.model';
import { ReplyModel } from '$lib/models/Reply.model';
import { PostModel } from '$lib/models/Post.model';
import { UserModel } from '$lib/models/User.model';
import mongoose from 'mongoose';

export const POST: RequestHandler = async ({ url, request, locals }) => {
    const user = locals.user;
    if (!user) return json({ message: 'You are not authorized' }, { status: 401 });

    const { confirmText } = await request.json();

    if (confirmText !== 'DELETE') {
        return json(
            { message: 'Invalid confirmation text' },
            { status: 400 }
        );
    }

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await FollowModel.deleteMany({ followerId: user._id }).session(session);
            await FollowModel.deleteMany({ followingId: user._id }).session(session);
            await LikeModel.deleteMany({ author: user._id }).session(session);
            await ReplyModel.deleteMany({ author: user._id }).session(session);
            await PostModel.deleteMany({ author: user._id }).session(session);
            await UserModel.deleteOne({ _id: user._id }).session(session);
        });

        return json({ message: "Account deleted successfully" });
    } catch (err) {
        console.log(err);
        return json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        session.endSession();
    }

}