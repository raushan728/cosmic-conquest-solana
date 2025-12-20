"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import GameMap from "../components/GameMap";
import Shipyard from "../components/Shipyard";
import BattleRoom from "../components/BattleRoom";
import AllianceHQ from "../components/AllianceHQ";
import QuestBoard from "../components/QuestBoard";
import { useGame } from "../hooks/useGame";
import {
  Rocket,
  Shield,
  Sword,
  Users,
  Map as MapIcon,
  Scroll,
} from "lucide-react";

export default function Home() {
  const { connected } = useWallet();
  const { isRegistered, initPlayer, loading, initGame } = useGame();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Command", icon: <Rocket className="w-4 h-4" /> },
    { id: "map", label: "Navig", icon: <MapIcon className="w-4 h-4" /> },
    { id: "shipyard", label: "Refit", icon: <Shield className="w-4 h-4" /> },
    { id: "battle", label: "Combat", icon: <Sword className="w-4 h-4" /> },
    { id: "alliance", label: "Guild", icon: <Users className="w-4 h-4" /> },
    { id: "quests", label: "Ops", icon: <Scroll className="w-4 h-4" /> },
  ];

  if (!connected) {
    return (
      <div className="min-h-screen bg-[url('/bg-space.jpg')] bg-cover bg-center flex items-center justify-center p-4">
        <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/50 p-12 rounded-2xl text-center shadow-[0_0_50px_rgba(6,182,212,0.3)] max-w-lg w-full">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-2 tracking-tighter">
            COSMIC CONQUEST
          </h1>
          <p className="text-cyan-200/70 mb-8 uppercase tracking-[0.3em] text-xs">
            Solana On-Chain Strategy
          </p>

          <div className="flex justify-center">
            {mounted && (
              <WalletMultiButton className="!bg-cyan-600 hover:!bg-cyan-500 !transition-all !rounded-none !uppercase !font-bold" />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            IDENTIFY YOURSELF
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Enter a callsign to register your neural link.
          </p>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-black border border-zinc-700 p-4 rounded text-white outline-none focus:border-cyan-500 mb-4 font-mono"
            maxLength={15}
          />

          <button
            onClick={() => initPlayer(username)}
            disabled={!username || loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Establish Link"}
          </button>

          {/* Dev Helper */}
          <div className="mt-8 pt-4 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-600 mb-2">DEVNET ADMIN TOOL</p>
            <button
              onClick={() => initGame(100, 100)}
              className="text-xs text-red-900 hover:text-red-500 underline"
            >
              [Initialize Game Global]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 md:pb-0">
      {/* Top Bar */}
      <header className="border-b border-white/10 p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></div>
          <h1 className="font-bold tracking-widest text-sm md:text-base hidden md:block">
            COSMIC CONQUEST <span className="text-cyan-500">BETA</span>
          </h1>
        </div>
        {mounted && (
          <WalletMultiButton className="!py-1 !px-4 !h-auto !text-xs" />
        )}
      </header>

      <main className="container mx-auto p-4 md:p-8 grid gap-8">
        {/* Conditional Tab Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "map" && <GameMap />}
          {activeTab === "shipyard" && <Shipyard />}
          {activeTab === "battle" && <BattleRoom />}
          {activeTab === "alliance" && <AllianceHQ />}
          {activeTab === "quests" && <QuestBoard />}
        </div>
      </main>

      {/* Bottom Navigation for Mobile / Sidebar for Desktop feel */}
      <div className="fixed bottom-0 left-0 w-full bg-neutral-900/90 backdrop-blur-xl border-t border-white/5 p-2 z-50 md:top-1/2 md:right-4 md:left-auto md:bottom-auto md:w-auto md:-translate-y-1/2 md:bg-transparent md:border-none md:p-0">
        <div className="flex md:flex-col justify-around md:gap-4 md:bg-black/50 md:p-4 md:rounded-2xl md:border md:border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                            flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 rounded-lg transition-all
                            ${
                              activeTab === tab.id
                                ? "text-cyan-400 bg-cyan-500/10 md:pl-4 md:pr-6"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            }
                        `}
            >
              {tab.icon}
              <span className="text-[10px] md:text-sm uppercase font-bold tracking-wider">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
