import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { MainLayout } from "@/components/layout/MainLayout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Toaster } from "@/components/ui/sonner"; // Import the Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sales Management System",
  description: "Built with Next.js and Shadcn",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers>
          {session ? <MainLayout>{children}</MainLayout> : <>{children}</>}
        </Providers>
        <Toaster richColors /> {/* Add the Toaster component here */}
      </body>
    </html>
  );
}