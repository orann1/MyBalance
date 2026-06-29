import { prisma } from "@/lib/db/prisma";

const DEV_USER_EMAIL = "dev@mybalance.local";

// TODO: Replace with session.user.id when Auth.js is introduced.
// This resolves the single seeded dev user for Phase 2B single-user mode.
export async function getDevUserId(): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEV_USER_EMAIL },
    select: { id: true },
  });
  return user.id;
}
