// app/(protected)/layout.jsx

import { checkUser } from "@/lib/checkUser";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  await checkUser();

  return <>{children}</>;
}

