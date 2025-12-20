"use client";

import { useGame } from "../hooks/useGame";
import {
  Zap,
  Pickaxe,
  Coins,
  Box,
  User,
  Heart,
  Star,
  Trophy,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { loading, playerData, harvestResources } = useGame();

  const [harvestCooldown, setHarvestCooldown] = useState(0);

  useEffect(() => {
    if (harvestCooldown > 0) {
      const timer = setTimeout(() => setHarvestCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [harvestCooldown]);

  const handleHarvest = async () => {
    if (harvestCooldown > 0) return;
    await harvestResources();
    setHarvestCooldown(10); // 10s cooldown
  };

  if (!playerData) return null;

  // Calculate percentages for bars
  const healthPercent = (playerData.health / 100) * 100; // max health 100 assumed
  const xpPercent = (playerData.xp / (playerData.level * 100)) * 100; // simplistic xp curve
  const energyPercent = Math.min(playerData.energy, 100); // visualize energy

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-50">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-900/50 rounded-full flex items-center justify-center border border-cyan-400">
            <User className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-300">
              {playerData.username}
            </h2>
            <div className="flex items-center gap-2 text-xs text-cyan-400/70">
              <MapPin className="w-3 h-3" />
              <span>
                Sector {playerData.x.toString()}, {playerData.y.toString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-cyan-400 mb-1">
              LEVEL {playerData.level.toString()}
            </div>
            <div className="w-32 h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-red-400 mb-1">HULL INTEGRITY</div>
            <div className="w-32 h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
              <div
                className="h-full bg-red-500"
                style={{ width: `${healthPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ResourceCard
          icon={<Pickaxe className="w-5 h-5 text-amber-600" />}
          label="Iron"
          value={playerData.iron.toString()}
          color="border-amber-700/50 bg-amber-900/10"
        />
        <ResourceCard
          icon={<Box className="w-5 h-5 text-emerald-500" />}
          label="Wood"
          value={playerData.wood.toString()}
          color="border-emerald-700/50 bg-emerald-900/10"
        />
        <ResourceCard
          icon={<Coins className="w-5 h-5 text-yellow-500" />}
          label="Gold"
          value={playerData.gold.toString()}
          color="border-yellow-700/50 bg-yellow-900/10"
        />
        <ResourceCard
          icon={<Zap className="w-5 h-5 text-blue-400" />}
          label="Energy"
          value={playerData.energy.toString()}
          color="border-blue-700/50 bg-blue-900/10"
        />
      </div>

      {/* Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={handleHarvest}
          disabled={harvestCooldown > 0 || loading}
          className={`
                relative overflow-hidden group px-6 py-3 rounded font-bold uppercase tracking-wider transition-all
                ${
                  harvestCooldown > 0
                    ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                    : "bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500 text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                }
            `}
        >
          <span className="flex items-center gap-2">
            <Pickaxe className={harvestCooldown > 0 ? "" : "animate-pulse"} />
            {harvestCooldown > 0
              ? `Recharging (${harvestCooldown}s)`
              : "Harvest Resources"}
          </span>
        </button>
      </div>
    </div>
  );
}

function ResourceCard({ icon, label, value, color }: any) {
  return (
    <div className={`p-3 rounded-lg border ${color} flex items-center gap-3`}>
      {icon}
      <div>
        <p className="text-xs uppercase opacity-70">{label}</p>
        <p className="text-lg font-mono font-bold">{value}</p>
      </div>
    </div>
  );
}
