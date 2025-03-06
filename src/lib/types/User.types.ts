export type UserModelType = Partial<{
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}> & {
    discordId: string;

    avatarUrl: string;
    username: string;
    displayName?: string | null;

    bio: string;
    followers: Array<FollowObjectType>;
    following: Array<FollowObjectType>;

    roles: Array<String>; // beta, mod, admin, superadmin
}

export type FollowObjectType = {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    discordId: string;
}