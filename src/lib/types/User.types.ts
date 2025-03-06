export type UserType = Partial<{
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}> & {
    discordId: string;

    avatarUrl: string;
    username: string;
    displayName?: string | null;

    bio: string;
    roles: Array<UserRoles>
}

export enum UserRoles {
    Beta = 'beta',
    Mod = 'moderator',
    Admin = 'administrator',
    SuperAdmin = 'superadmin'
}