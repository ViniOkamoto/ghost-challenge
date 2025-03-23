import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/query-provider";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GhostsPay Checkout",
  description: "Payment checkout solution by GhostsPay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.className}>
      <body className={`antialiased min-h-screen bg-background`}>
        <QueryProvider>
          <main className="flex flex-col">{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
