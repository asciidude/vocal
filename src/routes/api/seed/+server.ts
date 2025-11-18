import { error, json, type RequestHandler } from "@sveltejs/kit";
import { UserModel } from "$lib/models/User.model";
import { UserRoles, type UserType } from "$lib/types/User.types";
import { NODE_ENV } from "$env/static/private";
import { PostModel } from "$lib/models/Post.model";
import { ReplyModel } from "$lib/models/Reply.model";
import type { AttachmentType } from "$lib/types/Attachment.type";
import { FollowModel } from "$lib/models/Follow.model";
import { LikeModel } from "$lib/models/Like.model";
import type { AuthProviderType } from "src/lib/types/AuthProvider.type";
import { computeDocumentVector, tfidf } from "src/lib/utils/TF-IDF.util";

export const GET: RequestHandler = async() => {
    if(NODE_ENV === 'production') throw error(403, 'Unable to seed database in production environment');

    await UserModel.deleteMany();
    await UserModel.insertMany([{
        authProviders: [{
            platform: 'discord',
            id: '0'
        } as AuthProviderType],

        avatarUrl: 'https://images-ext-1.discordapp.net/external/bippMZ8cXIbrZpIqxAUInNx9-CiuwYDC22qRfw__xWU/%3Fsize%3D512/https/cdn.discordapp.com/avatars/735281668566286417/a283626a6dd90e462b01d2f3c8680a11.png?format=webp&quality=lossless',
        bannerUrl: 'https://cdn.discordapp.com/banners/801469073535139860/58491fb5533d617c30d303ab5f989ef1.png?size=1024',

        username: 'gseppo',
        displayName: 'Gseppo',

        bio: 'Hi, my name is Gseppo! How are you!?',
        roles: [UserRoles.Beta, UserRoles.Tester],

        userInterestVectors: {},
        followedHashtags: ['programming', 'tech', 'javascript', 'webdev'],
        excludedKeywords: []
    },
    {
        authProviders: [{
            platform: 'discord',
            id: '0'
        } as AuthProviderType],

        avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png?size=512',
        bannerUrl: 'none',

        username: '2deepyt',
        displayName: 'gone.',

        bio: 'Hello, I am gone. What\'s good?',
        roles: [UserRoles.Beta],
        
        userInterestVectors: {},
        followedHashtags: ['gaming', 'music', 'art', 'creative'],
        excludedKeywords: []
    }]);

    const gseppo = await UserModel.findOne({ username: 'gseppo' });
    const gone = await UserModel.findOne({ username: '2deepyt' });

    const gseppoPosts = [
        'Just made a revolutionary social media app. #programming #webdev',
        'I freaking love MongoDB!!!!!!! #tech #database',
        'React < Svelte #webdev',
        'I don\'t know what to post',
        'Hello!!'
    ];

    const gonePosts = [
        'Wow... what a game. #gaming #eldenring',
        'FL Studio is the goat #music #production',
        'Working on some designs for my album cover. #art #creative #music',
        'Live on Twitch w/ my friends! #gaming #friends #twitch',
        'Exploring new music genres lately... 8)'
    ];

    [...gseppoPosts, ...gonePosts].forEach(content => tfidf.addDocument(content));

    await PostModel.deleteMany();
    
    const gseppoPostDocs = await Promise.all(
        gseppoPosts.map(async (content) => {
            return await PostModel.create({
                author: gseppo!._id,
                content,
                attachments: [],
                postVectors: computeDocumentVector(content)
            });
        })
    );

    const gonePostDocs = await Promise.all(
        gonePosts.map(async (content) => {
            return await PostModel.create({
                author: gone!._id,
                content,
                attachments: [],
                postVectors: computeDocumentVector(content)
            });
        })
    );

    await ReplyModel.deleteMany();
    await ReplyModel.create({
        parent_post: gseppoPostDocs[0]._id,
        author: gone!._id,
        content: 'Dude I freaking love Svelte',
        attachments: []
    });

    await ReplyModel.create({
        parent_post: gonePostDocs[0]._id,
        author: gseppo!._id,
        content: 'RIGHT!?',
        attachments: []
    });
    
    await FollowModel.deleteMany();
    await FollowModel.create({
        followerId: gseppo!._id,
        followingId: gone!._id
    });

    await FollowModel.create({
        followerId: gone!._id,
        followingId: gseppo!._id
    });

    await LikeModel.deleteMany();
    await LikeModel.create({
        parent_post: gseppoPostDocs[0]._id,
        author: gone!._id
    });

    await LikeModel.create({
        parent_post: gonePostDocs[1]._id,
        author: gseppo!._id
    });

    await LikeModel.create({
        parent_post: gseppoPostDocs[2]._id,
        author: gone!._id
    });

    await LikeModel.create({
        parent_post: gonePostDocs[0]._id,
        author: gseppo!._id
    });

    if (gseppo) {
        const gseppoVector = { ...(gseppo.userInterestVectors || {}) };
        
        const likedPosts = [gonePostDocs[1], gonePostDocs[0]];
        likedPosts.forEach(post => {
            const postVector = post.postVectors || {};
            for (const [token, weight] of Object.entries(postVector)) {
                gseppoVector[token] = (gseppoVector[token] || 0) + weight;
            }
        });
        
        const mag = Math.sqrt(Object.values(gseppoVector).reduce((s, v) => s + v*v, 0)) || 1;
        for (const k in gseppoVector) {
            gseppoVector[k] = gseppoVector[k] / mag;
        }
        
        gseppo.userInterestVectors = gseppoVector;
        await gseppo.save();
    }

    if (gone) {
        const goneVector = { ...(gone.userInterestVectors || {}) };
        
        const likedPosts = [gseppoPostDocs[0], gseppoPostDocs[2]];
        likedPosts.forEach(post => {
            const postVector = post.postVectors || {};
            for (const [token, weight] of Object.entries(postVector)) {
                goneVector[token] = (goneVector[token] || 0) + weight;
            }
        });
        
        const mag = Math.sqrt(Object.values(goneVector).reduce((s, v) => s + v*v, 0)) || 1;
        for (const k in goneVector) {
            goneVector[k] = goneVector[k] / mag;
        }
        
        gone.userInterestVectors = goneVector;
        await gone.save();
    }

    return json({
        message: `Database seeded with ${gseppoPosts.length + gonePosts.length} posts and user interest vectors!`
    });
}