import { error } from '@sveltejs/kit';
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
    const user = locals.user as UserType | null;
    
    const userId = params.slug;
    if(!userId) throw error(400, 'Bad Request');

    const profileUser = await UserModel.findOne({ username: userId });
    if(!profileUser) throw error(404, 'Not Found');

    const followers = await FollowModel.find({ followingId: profileUser._id });
    const following = await FollowModel.find({ followerId: profileUser._id });

    const posts = await PostModel.find({ author: profileUser._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
        
    const userReplies = await ReplyModel.find({ author: profileUser._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

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

    const isFollowing = await FollowModel.exists({ followingId: profileUser._id, followerId: user?._id }) !== null;

    return {
        user: user,
        profileUser: {
            ...profileUser.toObject(),
            _id: profileUser._id.toString()
        } as UserType,
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