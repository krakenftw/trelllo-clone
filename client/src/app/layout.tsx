import type { Metadata } from "next";
import { Barlow, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/hooks/useAuth";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

const barlow = Barlow({
  variable: "--font-barlow",
  display: "swap",
  weight: "500",
  subsets: ["latin"],
});

const inter = Inter({
  display: "swap",
  weight: "300",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  TimeAgo.addDefaultLocale(en);
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>{children}</body>
        <Toaster />
      </UserProvider>
    </html>
  );
}
