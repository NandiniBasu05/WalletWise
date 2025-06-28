"use server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const clerkUserId = user.id;

  try {
    // First: Try to find the user
    const existingUser = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (existingUser) return existingUser;

    // Try to create
    return await db.user.create({
      data: {
        clerkUserId,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });
  } catch (error) {
    // If creation failed due to unique constraint (duplicate clerkUserId)
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("clerkUserId")
    ) {
      // Try to find the user again
      const userAfterRace = await db.user.findUnique({
        where: { clerkUserId },
      });
      if (userAfterRace) return userAfterRace;
    }

    console.error("checkUser error:", error);
    return null;
  }
};
