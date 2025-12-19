"use client";

import { useGame } from "../hooks/useGame";
import { useState } from "react";

export default function Dashboard() {
  const {
    loading,
    isRegistered,
    playerData,
    initPlayer,
    harvestResources,
    initGame,
  } = useGame();

  const [username, setUsername] = useState("");

  if (loading) {
    return (
      <div className="text-yellow-400 animate-pulse">
        TRANSMISSION PENDING...
      </div>
    );
  }

  
  if (!isRegistered) {
    return (
      <div className="p-8 border border-blue-500 bg-black/80 rounded-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          NEW COMMANDER IDENTIFIED
        </h2>

        
        <div className="mb-6 p-4 border border-red-500/50 rounded bg-red-900/20">
          <p className="text-xs text-red-300 mb-2">
            ⚠ ADMIN ZONE (Click Once Only)
          </p>
          <button
            onClick={initGame}
            className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white"
          >
            INITIALIZE UNIVERSE (Devnet)
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter Callsign (Username)"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={() => initPlayer(username)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold"
        >
          INITIALIZE PROTOCOL
        </button>
      </div>
    );
  }
  return (
    <div className="w-full max-w-4xl">
    </div>
  );
}
