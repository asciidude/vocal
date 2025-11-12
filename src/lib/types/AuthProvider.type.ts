export interface AuthProviderType {
  platform: string;
  id: string;
  email?: string;
  passwordHash?: string;
  refreshToken?: string;
  accessToken?: string
}


export type Platform = 'discord' | 'local';