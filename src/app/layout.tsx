import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable:'--inter' });

export const metadata: Metadata = {
  title: "Stellar Defi App",
  description: "Defi App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body bg-[#16161e]  text-white`}>
        {children}
        <Toaster toastOptions={{ className: "font-body", duration: 8000 }} />
      </body>
    </html>
  );
}
