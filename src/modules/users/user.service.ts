import { prisma } from "../../lib/prisma.js";
import { User } from "../../types/user.type.js";
export async function getUserFromSessionToken(sessionToken: string) {
  try {
    const sessionWithUser = await prisma.session.findFirst({
      where: { token: sessionToken },
      select: {
        user: true,
      },
    });
    return sessionWithUser;
  } catch (err) {}
}
