import { inngest } from "@/lib/inngest/client";
import {serve} from "inngest/next";
import { checkBudgetAlerts } from "@/lib/inngest/functions";
import { triggerRecurringTransactions } from "@/lib/inngest/functions";
import { processRecurringTransaction } from "@/lib/inngest/functions";
import { generateMonthlyReports } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
checkBudgetAlerts,
triggerRecurringTransactions,
processRecurringTransaction,
generateMonthlyReports,
    ],
});