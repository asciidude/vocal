import type { AuthProviderType } from "./AuthProvider.type";

export interface UserType {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;

    authProviders: AuthProviderType;

    avatarUrl: string;
    bannerUrl: string;

    username: string;
    displayName?: string | null;

    bio: string;
    roles: Array<UserRoles>
}

export enum UserRoles {
    Tester = 'tester',        // Site Testers
    Beta = 'beta',            // Beta Testers
    Admin = 'administrator',  // Site Admin
    SuperAdmin = 'superadmin' // Site Owner
}