export type UserModelType = Partial<{
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}> & {
    discordId: string;

    avatarUrl: string;
    username: string;
    displayName: string;

    bio: string;
    followers: Array<FollowObjectType>;
    following: Array<FollowObjectType>;
}

export type FollowObjectType = {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    discordId: string;
}