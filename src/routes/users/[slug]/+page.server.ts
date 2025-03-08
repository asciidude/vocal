import { error, type Load } from '@sveltejs/kit';
import { UserModel } from '$lib/models/User.model';
import type { UserType } from '$lib/types/User.types';
import { FollowModel } from '$lib/models/Follow.model';
import { PostModel } from '$lib/models/Post.model';
import { ReplyModel } from '$lib/models/Reply.model';
import type { PostType } from '$lib/types/Post.type';
import type { ReplyType } from '$lib/types/Reply.type';
import { LikeModel } from '$lib/models/Like.model';
import type { LikeType } from '$lib/types/Like.type';

export const load: Load = async({ params }) => {
    const userId = params.slug;
    if(!userId) throw error(400, 'Bad Request');

    const user = await UserModel.findOne({ discordId: userId });
    if(!user) throw error(404, 'Not Found');

    const followers = await FollowModel.countDocuments({ followingId: user._id });
    const following = await FollowModel.countDocuments({ followerId: user._id });

    const posts = await PostModel.find({ author: user._id }, { _id: true });
    const userReplies = await ReplyModel.find({ author: user._id }, { _id: true });

    let postLikes = [];
    const likePromises = posts.map(post => LikeModel.find({ parent_post: post._id }));
    postLikes = await Promise.all(likePromises);
    postLikes = postLikes.flat();

    let postReplies = [];
    const replyPromises = posts.map(post => ReplyModel.find({ parent_post: post._id }));
    postReplies = await Promise.all(replyPromises);
    postReplies = postReplies.flat();

    if(userReplies.length > 0) {
        /** TODO: Recursively look through replies and find post information to show parent post */
    }

    return {
        user: {
            ...user.toObject(),
            _id: user._id.toString()
        } as UserType,
        followers, following,
        posts: {
            posts: JSON.parse(JSON.stringify(posts)) as Array<PostType>,
            postReplies: JSON.parse(JSON.stringify(postReplies)) as Array<ReplyType>,
            userReplies: JSON.parse(JSON.stringify(userReplies)) as Array<ReplyType>,
            likes: JSON.parse(JSON.stringify(postLikes)) as Array<LikeType>
        }
    }
}