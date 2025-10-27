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

const parseAndStringify = (data: any) => {
    return JSON.parse(JSON.stringify(data));
}

export const load = async ({ params, locals }) => {
    const currentUser = locals.user as UserType | null;
    
    const userId = params.slug;
    if(!userId) throw error(400, 'Bad Request');

    const user = await UserModel.findOne({ discordId: userId });
    if(!user) throw error(404, 'Not Found');

    const followers = await FollowModel.find({ followingId: user._id });
    const following = await FollowModel.find({ followerId: user._id });

    const posts = await PostModel.find({ author: user._id });
    const userReplies = await ReplyModel.find({ author: user._id });

    let postLikes = [];
    const likePromises = posts.map(post => LikeModel.find({ parent_post: post._id }));
    postLikes = await Promise.all(likePromises);
    postLikes = postLikes.flat();

    let postReplies = [];
    const replyPromises = posts.map(post => ReplyModel.find({ parent_post: post._id }));
    postReplies = await Promise.all(replyPromises);
    postReplies = postReplies.flat();

    const followerUsers = await Promise.all(
        followers.map(f => UserModel.findById(f.followerId))
    );

    const followingUsers = await Promise.all(
        following.map(f => UserModel.findById(f.followingId))
    );

    if(userReplies.length > 0) {
        /** TODO: Recursively look through replies and find post information to show parent post */
    }

    const isFollowing = await FollowModel.exists({ followingId: user._id, followerId: currentUser?._id });
    
    return {
        user: {
            ...user.toObject(),
            _id: user._id.toString()
        } as UserType,
        currentUser: JSON.parse(currentUser),
        followingCount: following.length,
        followersCount: followers.length,
        following: parseAndStringify(followingUsers),
        followers: parseAndStringify(followerUsers),
        isFollowing,
        posts: {
            posts: parseAndStringify(posts) as Array<PostType>,
            postReplies: parseAndStringify(postReplies) as Array<ReplyType>,
            userReplies: parseAndStringify(userReplies) as Array<ReplyType>,
            likes: parseAndStringify(postLikes) as Array<LikeType>
        }
    }
}