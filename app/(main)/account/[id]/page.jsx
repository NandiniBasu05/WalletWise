export const dynamic = "force-dynamic";
export const dynamicParams = true;
import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

export default async function AccountPage({ children, params }) {
  try {
    
    const { id } = await params;

    const accountData = await getAccountWithTransactions(id);

    if (!accountData) {
      notFound();
    }

    const { transactions, ...account } = accountData;

    return (
      <div className="space-y-8 px-5">
        <div className="flex gap-4 items-end justify-between">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent pb-6 bg-gradient-to-b from-[#A96F44] to-[#F2ECB6] mb-4 capitalize">
              {account.name}
            </h1>
            <p className="text-muted-foreground">
              {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
            </p>
          </div>

          <div className="text-right pb-2">
            <div className="text-xl sm:text-2xl font-bold">
              ${parseFloat(account.balance).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {account._count.transactions} Transactions
            </p>
          </div>
        </div>

        <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#A96F44" />}>
          <AccountChart transactions={transactions} />
        </Suspense>

        <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#A96F44" />}>
          <TransactionTable transactions={transactions} />
        </Suspense>
        
        {children}
      </div>
    );
  } catch (error) {
    console.error("Error loading account:", error);
    notFound();
  }
}