import { error } from '@sveltejs/kit';
import { UserModel } from '$lib/models/User.model';
import type { UserType } from '$lib/types/User.types';
import { FollowModel } from '$lib/models/Follow.model';
import { PostModel } from '$lib/models/Post.model';
import { ReplyModel } from '$lib/models/Reply.model';
import { LikeModel } from '$lib/models/Like.model';

const parseAndStringify = (data: any) => {
    return JSON.parse(JSON.stringify(data));
}

export const load = async ({ locals }) => {
    const user = locals.user as UserType | null;
    if(!user) throw error(404, 'Not Found');

    const followers = await FollowModel.find({ followingId: user._id });
    const following = await FollowModel.find({ followerId: user._id });

    const posts = await PostModel.find({ author: user._id })
        .sort({ createdAt: -1 })
        .lean();
        
    const userReplies = await ReplyModel.find({ author: user._id });

    const replyLikePromises = userReplies.map(async (reply) => {
        const likes = await LikeModel.find({ parent_post: reply._id }).lean();
        return likes;
    });

    const replyLikesNested = await Promise.all(replyLikePromises);
    const replyLikes = replyLikesNested.flat();

    const nestedReplyPromises = userReplies.map(async (reply) => {
        const replies = await ReplyModel.find({ parent_post: reply._id }).lean();
        return replies;
    });

    const nestedRepliesNested = await Promise.all(nestedReplyPromises);
    const nestedReplies = nestedRepliesNested.flat();

    const likePromises = posts.map(async (post) => {
        const likes = await LikeModel.find({ parent_post: post._id }).lean();
        return likes;
    });

    const postLikesNested = await Promise.all(likePromises);
    const postLikes = postLikesNested.flat();
    
    const replyPromises = posts.map(async (post) => {
        const posts = await ReplyModel.find({ parent_post: post._id }).lean();
        return posts;
    });

    const postRepliesNested = await Promise.all(replyPromises);
    const postReplies = postRepliesNested.flat();

    const followerUsers = await Promise.all(
        followers.map(f => UserModel.findById(f.followerId))
    );

    const followingUsers = await Promise.all(
        following.map(f => UserModel.findById(f.followingId))
    );

    const isFollowing = await FollowModel.exists({ followingId: user._id, followerId: user?._id }) !== null;

    return {
        user,
        followingCount: following.length,
        followersCount: followers.length,
        following: parseAndStringify(followingUsers),
        followers: parseAndStringify(followerUsers),
        isFollowing,
        posts: {
            posts: parseAndStringify(posts),
            postReplies: parseAndStringify(postReplies),
            userReplies: parseAndStringify(userReplies),
            replyLikes: parseAndStringify(replyLikes),
            nestedReplies: parseAndStringify(nestedReplies),
            likes: parseAndStringify(postLikes),
        }
    }
}