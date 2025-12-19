"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-black text-white bg-[url('/space-bg.jpg')] bg-cover bg-fixed">
      <div className="w-full max-w-6xl flex justify-between items-center mb-12 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          COSMIC CONQUEST
        </h1>
        {mounted && <WalletMultiButton className="!bg-purple-700" />}
      </div>
      <div className="w-full flex justify-center">
        {mounted && !connected && (
          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold mb-4">
              Connect Wallet to Deploy
            </h2>
            <p className="text-gray-400">System running on Solana Devnet</p>
          </div>
        )}

        {mounted && connected && <Dashboard />}
      </div>
    </main>
  );
}
