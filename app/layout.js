import { Inter } from 'next/font/google'
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] })
export const metadata = {
  title: " WalletWise",
  description: "An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real-time insights.",
  
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" >
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
</head>
      <body
        className={`${inter.className} `}
      >
        <Header/>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
      </body>
    </html>
    </ClerkProvider>
  );
}
