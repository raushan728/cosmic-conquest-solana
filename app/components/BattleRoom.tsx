"use client";

import { useGame } from "../hooks/useGame";
import { useState } from "react";
import { Sword, Target, Radar, AlertTriangle } from "lucide-react";

export default function BattleRoom() {
  const { attackPlayer, loading, playerData } = useGame();
  const [targetKey, setTargetKey] = useState("");

  if (!playerData) return null;

  return (
    <div className="bg-black/80 p-6 rounded-xl border border-red-500/30 backdrop-blur-md">
      <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
        <Sword className="w-5 h-5" /> BATTLE ROOM
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg mb-4">
            <label className="text-xs text-red-400 uppercase font-bold mb-2 block">
              Target Coordinates (Wallet PubKey)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetKey}
                onChange={(e) => setTargetKey(e.target.value)}
                placeholder="Enter Enemy Public Key..."
                className="flex-1 bg-black border border-red-900/50 rounded p-2 text-red-100 placeholder-red-900/50 focus:border-red-500 outline-none font-mono text-sm"
              />
            </div>
          </div>

          <button
            onClick={() => attackPlayer(targetKey)}
            disabled={loading || !targetKey}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-[0.2em] rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <CrosshairIcon />
            INITIATE ATTACK SEQUENCE
          </button>
        </div>

        <div className="border border-gray-800 bg-black p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Radar className="w-6 h-6 text-green-500/50 animate-spin-slow" />
          </div>
          <h4 className="text-gray-500 text-xs font-bold mb-4 uppercase">
            Combat Log
          </h4>
          <div className="space-y-2 font-mono text-xs h-40 overflow-y-auto custom-scrollbar">
            <p className="text-green-500/70">&gt; Systems Online</p>
            <p className="text-yellow-500/70">
              &gt; Scanning nearby sectors...
            </p>
            <p className="text-gray-600">
              &gt; No hostile signatures in immediate vicinity.
            </p>
            {playerData.lastLogin && (
              <p className="text-blue-400">
                &gt; Last Login:{" "}
                {new Date(Number(playerData.lastLogin) * 1000).toLocaleString()}
              </p>
            )}
            <div className="mt-4 p-2 bg-red-900/20 rounded border border-red-900/30">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-3 h-3" />
                <span>CAUTION: PvP Zone Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrosshairIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
      />
    </svg>
  );
}
