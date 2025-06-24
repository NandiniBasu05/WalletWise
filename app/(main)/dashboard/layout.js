
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import DashboardPage from "./page";

export default function Layout() {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent pb-6 bg-gradient-to-b from-[#A96F44] to-[#F2ECB6] mb-5">
          Dashboard
        </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#A96F44" />} 
      >
        <DashboardPage/>
      </Suspense>
    </div>
  );
}