// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { MainLayout } from "@/components/layout/MainLayout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sales Management System",
  description: "Built with Next.js and Shadcn",
};

export default async function RootLayout({ children }) {
  // This line was missing. It fetches the session on the server.
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
          {/* Now the 'session' variable is defined and this check will work */}
          {session ? <MainLayout>{children}</MainLayout> : <>{children}</>}
        </Providers>
      </body>
    </html>
  );
}