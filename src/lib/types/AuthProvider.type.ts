export interface AuthProviderType {
  platform: Platform;
  id: string;
  email?: string;
  passwordHash?: string;
  refreshToken?: string;
  accessToken?: string
}


export type Platform = 'discord' | 'local';