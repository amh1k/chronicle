import type { AuthUser } from "./auth.type.js";

export type User = AuthUser;
export type UserMiddleware = {
  User: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

export interface UserWithSessionToken extends AuthUser {
  sessionToken?: string;
}
