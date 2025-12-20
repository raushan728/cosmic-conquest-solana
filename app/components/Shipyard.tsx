"use client";

import { useGame } from "../hooks/useGame";
import { useGameSound } from "../hooks/useGameSound";
import { Hammer, Rocket, Shield, Zap } from "lucide-react";

export default function Shipyard() {
  const { playerData, craftItem, loading } = useGame();
  const { playHover } = useGameSound();

  if (!playerData) return null;

  const items = [
    {
      id: "titaniumHull",
      name: "Titanium Hull",
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      level: playerData.hullLevel,
      desc: "Increases max health.",
      cost: "50 Wood, 50 Iron",
    },
    {
      id: "laserCannon",
      name: "Laser Cannon",
      icon: <Zap className="w-8 h-8 text-red-500" />,
      level: playerData.cannonLevel,
      desc: "Increases attack damage.",
      cost: "30 Iron, 10 Gold",
    },
    {
      id: "warpEngine",
      name: "Warp Engine",
      icon: <Rocket className="w-8 h-8 text-purple-400" />,
      level: playerData.engineLevel,
      desc: "Travel further with less energy.",
      cost: "100 Wood, 20 Gold",
    },
  ];

  return (
    <div className="bg-black/80 p-6 rounded-xl border border-purple-500/30 backdrop-blur-md">
      <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
        <Hammer className="w-5 h-5" /> SHIPYARD
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-gray-800 rounded-lg">{item.icon}</div>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                LVL {item.level}
              </span>
            </div>
            <h4 className="text-lg font-bold text-gray-200 mb-1">
              {item.name}
            </h4>
            <p className="text-xs text-gray-500 mb-4">{item.desc}</p>

            <div className="bg-black/50 p-2 rounded text-xs font-mono text-gray-400 mb-4">
              COST: {item.cost}
            </div>

            <button
              onClick={() => {
                craftItem(item.id as any);
              }}
              disabled={loading}
              onMouseEnter={() => playHover()}
              className="w-full py-2 bg-purple-900/40 border border-purple-500/50 hover:bg-purple-800/50 text-purple-200 rounded text-sm font-bold uppercase"
            >
              CRAFT UPGRADE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
