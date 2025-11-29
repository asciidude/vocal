import { FollowModel } from "../models/Follow.model";
import { PostModel } from "../models/Post.model";
import { UserModel } from "../models/User.model";
import type { FollowType } from "../types/Follow.type";
import type { PostType } from "../types/Post.type";
import type { UserType } from "../types/User.types";
import { cosineSimilarity } from "./TF-IDF.util";

export interface FeedOptions {
    limit?: number;
    minSimilarity?: number;
    skip?: number;
    seenIds?: Array<string>;
    hashtag?: string;
}

export interface SearchQuery {
    _id?: Object, // seen ids
    content?: Object // content
}

export class FeedAlgorithm {
    static async generateFeed(userId: string, options: FeedOptions = {}) {
        const { limit = 15, minSimilarity = 0.1, seenIds = [] } = options;
        let { hashtag = null } = options;
        let search: SearchQuery = { _id: { $nin: seenIds } };

        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User not found");

        if (hashtag) {
            if(!hashtag.startsWith('#')) {
                hashtag = `#${hashtag}`;
            }
            
            search.content = {
                $regex: hashtag, $options: 'i'
            }
        }

        const rawPosts = await PostModel.find(search)
            .populate("author", "username displayName avatarUrl")
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        if (rawPosts.length === 0) return [];

        const posts = await Promise.all(
            rawPosts.map(async (post) => {
                const authorObj = await UserModel.findById(post.author).lean();
                return { ...post, authorObj };
            })
        );

        const usedPostIds = new Set<string>();
        const finalFeed: any[] = [];

        const addPostsToFeed = (postsToAdd: any[], maxCount: number) => {
            const available = postsToAdd.filter(p => !usedPostIds.has(p._id.toString()));
            const toAdd = available.slice(0, Math.min(maxCount, limit - finalFeed.length));
            
            toAdd.forEach(post => {
                usedPostIds.add(post._id.toString());
                finalFeed.push(post);
            });
        };

        if (finalFeed.length < limit) {
            const followingPosts = await this.getFollowingPosts(user, posts);
            addPostsToFeed(followingPosts, Math.floor(limit * 0.10));
        }

        if (finalFeed.length < limit) {
            const hashtagPosts = this.getFollowedHashtagPosts(user, posts);
            addPostsToFeed(hashtagPosts, Math.floor(limit * 0.15));
        }

        if (finalFeed.length < limit) {
            const recommendedPosts = await this.getRecommendedPosts(user, posts, minSimilarity);
            addPostsToFeed(recommendedPosts, Math.floor(limit * 0.70));
        }

        if (finalFeed.length < limit) {
            const unusedPosts = posts.filter(p => !usedPostIds.has(p._id.toString()));
            const randomPosts = this.getRandomPosts(unusedPosts);
            addPostsToFeed(randomPosts, Math.floor(limit * 0.05));
        }

        if (finalFeed.length < limit) {
            const unusedPosts = posts.filter(p => !usedPostIds.has(p._id.toString()));
            addPostsToFeed(unusedPosts, limit);
        }

        return finalFeed.slice(0, limit);
    }

    private static async getFollowingPosts(user: UserType, posts: PostType[]) {
        const follows = await FollowModel.find({ followerId: user._id });
        if (!follows.length) return [];

        const followingIds = new Set(follows.map((f: FollowType) => f.followingId.toString()));

        return posts.filter(p =>
            followingIds.has(p.author.toString())
        );
    }

    private static getFollowedHashtagPosts(user: UserType, posts: PostType[]) {
        if (!user.followedHashtags?.length) return [];

        const tags = user.followedHashtags.map(h => h.toLowerCase());

        return posts.filter((post) => {
            const postTags = this.extractHashtags(String(post.content));
            return postTags.some(tag => tags.includes(tag));
        });
    }

    private static async getRecommendedPosts(
        user: UserType,
        posts: PostType[],
        minSimilarity: number
    ) {
        const userVec = user.userInterestVectors ?? {};
        const excluded = user.excludedKeywords ?? [];

        const scored = posts.map((post) => {
            const postVec = post.postVectors ?? {};
            const sim = cosineSimilarity(userVec, postVec);

            if (sim < minSimilarity) {
                return { post, score: -1 };
            }

            const blocked = excluded.some(keyword =>
                post.content.toLowerCase().includes(keyword.toLowerCase())
            );

            if (blocked) {
                return { post, score: -1 };
            }

            const overlap = this.calculateHashtagOverlap(user, post);
            const score = sim * 0.6 + overlap * 0.4;

            return { post, score };
        });

        return scored
            .filter(s => s.score >= 0)
            .sort((a, b) => b.score - a.score)
            .map(s => s.post);
    }

    private static getRandomPosts(posts: PostType[]) {
        return this.shuffleArray([...posts]);
    }

    private static calculateHashtagOverlap(user: UserType, post: PostType) {
        if (!user.followedHashtags?.length) return 0;

        const postTags = this.extractHashtags(String(post.content));
        const userTags = user.followedHashtags.map(h => h.toLowerCase());

        const matches = postTags.filter(tag => userTags.includes(tag));
        return matches.length / Math.max(userTags.length, 1);
    }

    private static extractHashtags(content: string) {
        const regex = /#(\w+)/g;
        const match = content.match(regex);
        return match ? match.map(m => m.slice(1).toLowerCase()) : [];
    }

    private static shuffleArray<T>(arr: T[]): T[] {
        const out = [...arr];
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    }
}