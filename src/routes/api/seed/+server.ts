import { error, json } from "@sveltejs/kit";
import { UserModel } from "$lib/models/User.model";
import type { UserModelType } from "$lib/types/User.types";
import { NODE_ENV } from "$env/static/private";

export const GET = async() => {
    if(NODE_ENV === 'production') throw error(403, 'Unable to seed database in production envrionment');

    await UserModel.deleteMany();
    await UserModel.insertMany([{
        discordId: '735281668566286417',

        avatarUrl: 'https://images-ext-1.discordapp.net/external/bippMZ8cXIbrZpIqxAUInNx9-CiuwYDC22qRfw__xWU/%3Fsize%3D512/https/cdn.discordapp.com/avatars/735281668566286417/a283626a6dd90e462b01d2f3c8680a11.png?format=webp&quality=lossless',
        
        username: 'gseppo',
        displayName: 'Gseppo',

        bio: 'fartstream69',
        followers: [
            {
                _id: 'idfk',
                username: '2deepyt',
                displayName: 'gone.',
                avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png?size=4096',
                discordId: '1045326923775103027'
            }
        ],
        following: []
    },
    {

        discordId: '1045326923775103027',

        avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png?size=4096',
        
        username: '2deepyt',
        displayName: 'gone.',

        bio: 'epic fartstreams69',
        followers: [],
        following: [
            {
                _id: 'idfk',
                username: 'gseppo',
                displayName: 'Gseppo.',
                avatarUrl: 'https://images-ext-1.discordapp.net/external/bippMZ8cXIbrZpIqxAUInNx9-CiuwYDC22qRfw__xWU/%3Fsize%3D512/https/cdn.discordapp.com/avatars/735281668566286417/a283626a6dd90e462b01d2f3c8680a11.png?format=webp&quality=lossless',
                discordId: '735281668566286417'
            }
        ]
    }] as Array<UserModelType>);

    return json({
        message: 'The database has been seeded.'
    })
}