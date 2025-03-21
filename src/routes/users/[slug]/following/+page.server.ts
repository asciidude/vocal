import { error, type Load } from '@sveltejs/kit';
import { UserModel } from '$lib/models/User.model';
import type { UserType } from '$lib/types/User.types';

export const load: Load = async({ params }) => {
    const userId = params.slug;
    if(!userId) throw error(400, 'Bad Request');

    const user = await UserModel.findOne({ discordId: userId });
    if(!user) throw error(404, 'Not Found');

    return {
        user: {
            ...user.toObject(),
            _id: user._id.toString()
        } as UserType
    }
}