
export const dynamic = "force-dynamic";

import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../_components/transaction-form"; // Default import
import { getTransaction } from "@/actions/transaction";



export default async function Page({ searchParams }) {
  // Safely handle searchParams
  const editId =  searchParams?.edit;
  const accounts = await getUserAccounts();
  
  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl  bg-clip-text text-transparent font-bold pb-6 bg-gradient-to-b from-[#A96F44] to-[#F2ECB6]">Add Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}