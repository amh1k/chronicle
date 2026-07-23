import type { AuthUser } from "../auth/auth.type.js";

export type User = AuthUser;

export interface UserWithSessionToken extends AuthUser {
  sessionToken?: string;
}

