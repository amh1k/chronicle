interface TempUser {}

declare global {
  namespace Express {
    interface Request {
      user?: TempUser;
    }
  }
}

export {};
