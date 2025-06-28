"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { checkUser } from "@/lib/checkUser";

const serializeTransaction = (obj) => {
  return {
    ...obj,
    balance: typeof obj.balance?.toNumber === "function" ? obj.balance.toNumber() : obj.balance,
    amount: typeof obj.amount?.toNumber === "function" ? obj.amount.toNumber() : obj.amount,
  };
};

export async function getUserAccounts() {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  return accounts.map(serializeTransaction);
}

export async function createAccount(data) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("Unauthorized");

    const req = await request();

    const decision = await aj.protect(req, {
      userId: user.clerkUserId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked.");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    console.error("Account creation failed:", error.message);
    throw new Error(error.message);
  }
}

export async function getDashboardData() {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
