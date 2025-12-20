"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "../components/Dashboard";
import GameMap from "../components/GameMap";
import Shipyard from "../components/Shipyard";
import BattleRoom from "../components/BattleRoom";
import AllianceHQ from "../components/AllianceHQ";
import QuestBoard from "../components/QuestBoard";
import SpaceBackground from "../components/SpaceBackground";
import ClickSpark from "../components/ClickSpark";
import { useGame } from "../hooks/useGame";
import { useGameSound } from "../hooks/useGameSound";
import {
  Rocket,
  Shield,
  Sword,
  Users,
  Map as MapIcon,
  Scroll,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function Home() {
  const { connected } = useWallet();
  const { isRegistered, initPlayer, loading, initGame } = useGame();
  const {
    playHover,
    playClick,
    playTransition,
    playBgm,
    stopBgm,
    toggleMute,
    isMuted,
    mounted: soundMounted,
  } = useGameSound();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const startAudio = () => {
      console.log("User Interaction: Starting BGM");
      playBgm();
      window.removeEventListener("click", startAudio);
      window.removeEventListener("keydown", startAudio);
    };

    window.addEventListener("click", startAudio);
    window.addEventListener("keydown", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("keydown", startAudio);
      stopBgm();
    };
  }, [playBgm, stopBgm]);
  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId) return;
    playTransition();
    setActiveTab(tabId);
  };

  const tabs = [
    { id: "dashboard", label: "Command", icon: <Rocket className="w-5 h-5" /> },
    { id: "map", label: "Navig", icon: <MapIcon className="w-5 h-5" /> },
    { id: "shipyard", label: "Refit", icon: <Shield className="w-5 h-5" /> },
    { id: "battle", label: "Combat", icon: <Sword className="w-5 h-5" /> },
    { id: "alliance", label: "Guild", icon: <Users className="w-5 h-5" /> },
    { id: "quests", label: "Ops", icon: <Scroll className="w-5 h-5" /> },
  ];
  const tabVariants = {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.95 },
  };

  if (!connected) {
    return (
      <SpaceBackground>
        <div className="min-h-screen flex items-center justify-center p-4 relative z-50">
          <ClickSpark />

          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 p-12 rounded-2xl text-center shadow-[0_0_80px_rgba(6,182,212,0.2)] max-w-lg w-full">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 tracking-tighter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              COSMIC <br /> CONQUEST
            </h1>
            <p className="text-cyan-200/70 mb-10 uppercase tracking-[0.4em] text-xs animate-pulse">
              Solana On-Chain Strategy
            </p>

            <div
              className="flex justify-center transform hover:scale-105 transition-transform duration-300"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              {mounted && (
                <WalletMultiButton className="!bg-cyan-600 hover:!bg-cyan-500 !transition-all !rounded-none !uppercase !font-bold !px-8 !py-4 !h-auto !text-lg shadow-[0_0_20px_rgba(8,145,178,0.5)] clip-path-polygon-[10%_0,100%_0,100%_90%,90%_100%,0_100%,0_10%]" />
              )}
            </div>
          </div>
        </div>
      </SpaceBackground>
    );
  }

  if (!isRegistered) {
    return (
      <SpaceBackground>
        <div className="min-h-screen flex items-center justify-center p-4 z-50 relative">
          <ClickSpark />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 p-8 rounded-xl relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
              IDENTIFY YOURSELF
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              Enter a callsign to register your neural link.
            </p>

            <input
              type="text"
              placeholder="Enter Callsign..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-zinc-700 p-4 rounded text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-6 font-mono text-lg transition-all"
              maxLength={15}
            />

            <button
              onClick={() => {
                playClick();
                initPlayer(username);
              }}
              onMouseEnter={() => playHover()}
              disabled={!username || loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded uppercase tracking-widest transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
            >
              {loading ? "Initializing Link..." : "Establish Neural Link"}
            </button>

            <div className="mt-8 pt-4 border-t border-zinc-800/50 text-center">
              <p className="text-xs text-zinc-600 mb-2">DEVNET ADMIN TOOL</p>
              <button
                onClick={() => {
                  playClick();
                  initGame(100, 100);
                }}
                onMouseEnter={() => playHover()}
                className="text-xs text-red-900 hover:text-red-500 underline"
              >
                [Initialize Game Global]
              </button>
            </div>
          </motion.div>
        </div>
      </SpaceBackground>
    );
  }

  return (
    <SpaceBackground>
      <ClickSpark />
      <div className="min-h-screen text-white pb-32 md:pb-0 relative z-10 flex flex-col">
        <header className="px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></div>
              <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <h1 className="font-bold tracking-[0.2em] text-sm md:text-base hidden md:block text-cyan-50">
              COSMIC CONQUEST{" "}
              <span className="text-cyan-400 text-xs ml-2 border border-cyan-500/30 px-1 rounded">
                BETA v1.0
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                playClick();
                toggleMute();
              }}
              onMouseEnter={playHover}
              className="p-2 rounded-full hover:bg-white/10 text-cyan-400 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {mounted && (
              <WalletMultiButton className="!py-1.5 !px-4 !h-auto !text-xs !bg-cyan-900/30 !border !border-cyan-500/50 hover:!bg-cyan-800/50 transition-all font-mono" />
            )}
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="flex-1"
            >
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "map" && <GameMap />}
              {activeTab === "shipyard" && <Shipyard />}
              {activeTab === "battle" && <BattleRoom />}
              {activeTab === "alliance" && <AllianceHQ />}
              {activeTab === "quests" && <QuestBoard />}
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 md:px-0">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex justify-between items-center gap-1 md:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                onMouseEnter={() => playHover()}
                className={`
                                relative group flex flex-col items-center justify-center p-3 md:p-4 rounded-full transition-all duration-300
                                ${
                                  activeTab === tab.id
                                    ? "text-black bg-cyan-400 shadow-[0_0_20px_cyan]"
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                                }
                            `}
              >
                {tab.icon}
                <span
                  className={`
                    absolute -top-10 text-[10px] uppercase font-bold tracking-widest bg-black/80 text-white px-2 py-1 rounded border border-white/10
                    opacity-0 transform translate-y-2 transition-all duration-200 pointer-events-none
                    ${
                      activeTab === tab.id
                        ? "opacity-0"
                        : "group-hover:opacity-100 group-hover:translate-y-0"
                    }
                  `}
                >
                  {tab.label}
                </span>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SpaceBackground>
  );
}
