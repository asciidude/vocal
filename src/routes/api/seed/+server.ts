import { error, json } from "@sveltejs/kit";
import { UserModel } from "$lib/models/User.model";
import { UserRoles, type UserType } from "$lib/types/User.types";
import { NODE_ENV } from "$env/static/private";
import { PostModel } from "$lib/models/Post.model";
import { ReplyModel } from "$lib/models/Reply.model";
import type { AttachmentType } from "$lib/types/Attachment.type";
import { FollowModel } from "$lib/models/Follow.model";
import { LikeModel } from "$lib/models/Like.model";

export const GET = async() => {
    if(NODE_ENV === 'production') throw error(403, 'Unable to seed database in production envrionment');

    await UserModel.deleteMany();
    await UserModel.insertMany([{
        discordId: '735281668566286417',

        avatarUrl: 'https://images-ext-1.discordapp.net/external/bippMZ8cXIbrZpIqxAUInNx9-CiuwYDC22qRfw__xWU/%3Fsize%3D512/https/cdn.discordapp.com/avatars/735281668566286417/a283626a6dd90e462b01d2f3c8680a11.png?format=webp&quality=lossless',
        bannerUrl: 'https://cdn.discordapp.com/banners/801469073535139860/58491fb5533d617c30d303ab5f989ef1.png?size=1024',

        username: 'gseppo',
        displayName: 'Gseppo',

        bio: 'fartstream69',
        roles: [UserRoles.Beta]
    } as UserType,
    {

        discordId: '1045326923775103027',

        avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png?size=512',
        bannerUrl: 'none',

        username: '2deepyt',
        displayName: 'gone.',

        bio: 'epic fartstreams69',
        roles: [UserRoles.Beta]
    } as UserType]);

    const gseppo = await UserModel.findOne({ discordId: '735281668566286417' });
    const gone = await UserModel.findOne({ discordId: '1045326923775103027' });

    await PostModel.deleteMany();
    const post = await PostModel.insertOne({
        author: gseppo!._id,
        content: 'Hello world!',
        attachments: []
    });

    await ReplyModel.insertOne({
        parent_post: post._id,
        author: gone!._id,
        content: 'Hello ?_?',
        attachments: [{
            url: 'https://media.tenor.com/6kYNH_1ry08AAAAi/hello.gif',
            type: 'image'
        } as AttachmentType]
    });
    
    await FollowModel.insertOne({
        followerId: gseppo!._id,
        followingId: gone!._id
    });

    await LikeModel.insertOne({
        parent_post: post._id,
        author: gone!._id
    });

    return json({
        message: 'The database has been seeded.'
    });
}