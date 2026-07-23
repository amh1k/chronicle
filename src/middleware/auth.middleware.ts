import { MiddlewareFunction } from "./middleware.type.js";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { getUserFromSessionToken } from "../modules/users/user.service.js";
import { User } from "../../generated/prisma/browser";
const verifySession: MiddlewareFunction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionToken = req.cookies?.sessionToken;
    if (!sessionToken) {
      throw new ApiError(401, "unauthorized");
    }
    const sessionWithUser = await getUserFromSessionToken(sessionToken);
    if (!sessionWithUser) {
      throw new ApiError(401, "Session token not found");
    }
    req.user = sessionWithUser.user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message);
    }

    throw new ApiError(401, "Invalid session token");
  }
};
