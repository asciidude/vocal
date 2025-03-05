export type UserModelType = {
    _id: string;
    discordId: string;

    avatarUrl: string;
    username: string;
    displayName: string;

    bio: string;
    followers: Array<FollowObjectType>;
    following: Array<FollowObjectType>;

    createdAt: string;
    updatedAt: string;
}

export type FollowObjectType = {
    _id: string;
    username: string;
    avatarUrl: string;
    discordId: string;
}