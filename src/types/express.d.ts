import type { User } from "../modules/users/user.type.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
