import { prisma } from "../../lib/prisma.js";
export async function getUserFromSessionToken(sessionToken: string) {
  try {
    const sessionWithUser = await prisma.session.findFirst({
      where: { token: sessionToken },
      include: {
        user: true,
      },
    });
    return sessionWithUser;
  } catch (err) {}
}
