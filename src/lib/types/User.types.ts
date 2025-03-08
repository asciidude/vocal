export type UserType = Partial<{
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}> & {
    discordId: string;

    avatarUrl: string;
    bannerUrl: string;

    username: string;
    displayName?: string | null;

    bio: string;
    roles: Array<UserRoles>
}

export enum UserRoles {
    Beta = 'beta',            // Beta Testers
    Admin = 'administrator',  // Site Admin
    SuperAdmin = 'superadmin' // Site Owner
}