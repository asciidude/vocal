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
    skip?: number
}

export class FeedAlgorithm {
    static async generateFeed(userId: string, options: FeedOptions = {}) {
        const { limit = 15, minSimilarity = 0.1, skip = 0 } = options;

        const user = await UserModel.findById(userId);
        if (!user) throw new Error('User not found');

        const allPosts = await PostModel.find({})
            .populate('author', 'username displayName avatarUrl')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit * 30)
            .lean();

        const feedSections = await Promise.all([
            this.getFollowingPosts(user, allPosts, Math.floor(limit * 0.10)),
            this.getFollowedHashtagPosts(user, allPosts, Math.floor(limit * 0.15)),
            this.getRecommendedPosts(user, allPosts, Math.floor(limit * 0.70)),
            this.getRandomPosts(allPosts, Math.floor(limit * 0.05))
        ]);

        const seenIds = new Set();
        const finalFeed: any[] = [];

        for (const section of feedSections) {
            for (const post of section) {
                if (!seenIds.has(post._id.toString())) {
                    finalFeed.push(post);
                    seenIds.add(post._id.toString());
                }
            }
        }

        if (finalFeed.length < limit) {
            const remainingPosts = limit - finalFeed.length;
            const extraPosts = this.getRandomPosts(
                allPosts.filter(p => !seenIds.has(p._id.toString())),
                remainingPosts
            );
            finalFeed.push(...extraPosts);
        }

        return finalFeed.slice(0, limit);
    }

    private static async getFollowingPosts(user: UserType, allPosts: PostType[], count: number) {
        const following = await FollowModel.find({ followerId: user._id });

        if (!following || following.length === 0) return [];

        const followingIds = following.map((f: FollowType) => f.followingId);
        const followingPosts = allPosts.filter(post =>
            followingIds.includes(post.author)
        );

        return this.shuffleArray(followingPosts).slice(0, count);
    }

    private static getFollowedHashtagPosts(user: UserType, allPosts: PostType[], count: number) {
        if(!user.followedHashtags || user.followedHashtags.length === 0) return [];

        const followedHashtags = user.followedHashtags.map((h: string) => h.toLowerCase());
        const hashtagPosts = allPosts.filter(post => {
            const postHashtags = this.extractHashtags(String(post.content));
            return postHashtags.some((hashtag: string) => {
                followedHashtags.includes(hashtag.toLowerCase())
            });
        });

        return this.shuffleArray(hashtagPosts).slice(0, count);
    }

    private static async getRecommendedPosts(user: UserType, allPosts: PostType[], count: number) {
        const userVector = user.userInterestVectors || {};
        const excludedKeywords = user.excludedKeywords || [];

        const scoredPosts = allPosts.map((post: PostType) => {
            const postVector = post.postVectors || {};
            const similarityScore = cosineSimilarity(userVector, postVector);

            const hasExcludedKeyword = excludedKeywords.some((keyword: string) => {
                post.content.toLowerCase().includes(keyword.toLowerCase());
            });

            const hashtagOverlapScore = this.calculateHashtagOverlap(user, post);

            const score = hasExcludedKeyword ? -1 :
                (similarityScore * 0.6) + (hashtagOverlapScore * 0.4);
            
            return { post, score }
        });

        const filteredPosts = scoredPosts
            .filter((i) => i.score >= 0)
            .sort((a, b) => b.score - a.score);
        
        return filteredPosts.slice(0, count).map((i) => i.post);
    }

    private static getRandomPosts(allPosts: PostType[], count: number) {
        return this.shuffleArray(allPosts).slice(0, count);
    }

    private static calculateHashtagOverlap(user: UserType, post: PostType) {
        if(!user.followedHashtags || user.followedHashtags.length === 0) return 0;

        const postHashtags = this.extractHashtags(String(post.content));
        const userHashtags = user.followedHashtags.map((hashtag: string) => hashtag.toLowerCase());
        
        const matches = postHashtags.filter((hashtag: string) => {
            userHashtags.includes(hashtag.toLowerCase())
        });

        return matches.length / Math.max(userHashtags.length, 1);
    }

    private static extractHashtags(content: string) {
        const hashtagRegex = /#(\w+)/g;
        const matches = content.match(hashtagRegex);
        return matches ? matches.map((m) => m.slice(1).toLowerCase()) : [];
    }

    private static shuffleArray(array: any[]) {
        const shuffled = [...array];

        for(let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }
}