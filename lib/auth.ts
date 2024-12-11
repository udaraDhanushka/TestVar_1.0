import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as User;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}