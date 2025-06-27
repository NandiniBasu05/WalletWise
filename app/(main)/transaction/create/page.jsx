export const dynamic = "force-dynamic";

import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function Page({ searchParams }) {
  try {
    
    const awaitedSearchParams = await searchParams;
    
    
    const edit = typeof awaitedSearchParams?.edit === 'string' 
      ? awaitedSearchParams.edit 
      : undefined;

    const accounts = await getUserAccounts();
    
    let initialData = null;
    if (edit) {
      const transaction = await getTransaction(edit);
      initialData = transaction;
    }

    return (
      <div className="max-w-3xl mx-auto px-5">
        <div className="flex justify-center md:justify-normal mb-8">
          <h1 className="text-5xl bg-clip-text text-transparent font-bold pb-6 bg-gradient-to-b from-[#A96F44] to-[#F2ECB6]">
            {edit ? "Edit Transaction" : "Add Transaction"}
          </h1>
        </div>
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!edit}
          initialData={initialData}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in transaction page:", error);
    return <div>Error loading transaction form</div>;
  }
}