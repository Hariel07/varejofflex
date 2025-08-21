import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function PostLogin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const user: any = session.user;
  const userType = user.userType || user.role;

  if (userType === 'owner_saas') {
    redirect('/dashboard/owner');
  }
  if (userType === 'lojista') {
    redirect('/dashboard/lojista');
  }

  redirect('/dashboard');
}
