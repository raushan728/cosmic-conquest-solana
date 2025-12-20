import type { Metadata } from "next";
import { WalletContextProvider } from "../contexts/WalletContextProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmic Conquest",
  description: "A Fully On-Chain Solana RTS Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
