import type { Metadata } from "next";
import "./global.css";
import { poppins, inter } from "./fonts";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/providers/query-client-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "VISITNA!",
  description: "Visitor Management System",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", poppins.variable, inter.variable)}
    >
      <body className="min-h-full flex flex-col font-body">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
