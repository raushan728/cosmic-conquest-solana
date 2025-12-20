"use client";

import { useGame } from "../hooks/useGame";
import { useEffect, useState } from "react";
import { Crosshair } from "lucide-react";

export default function GameMap() {
  const { playerData, movePlayer, gameData, loading } = useGame();
  const width = gameData?.maxX || 10;
  const height = gameData?.maxY || 10;
  const GRID_SIZE = 10;

  const handleCellClick = (x: number, y: number) => {
    if (loading) return;
    if (x === playerData?.x && y === playerData?.y) return;
    movePlayer(x, y);
  };

  if (!playerData) return null;

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  return (
    <div className="bg-black/80 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-md">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Crosshair className="w-5 h-5" /> SECTOR MAP
      </h3>

      <div
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          maxWidth: "500px",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);

          const isPlayerHere = playerData.x === x && playerData.y === y;
          const distance = getDistance(playerData.x, playerData.y, x, y);
          const isFog = distance > 3;

          return (
            <div
              key={`${x}-${y}`}
              onClick={() => !isFog && handleCellClick(x, y)}
              className={`
                                aspect-square border rounded-sm flex items-center justify-center cursor-pointer transition-all duration-300
                                ${
                                  isPlayerHere
                                    ? "bg-cyan-500 border-cyan-300 shadow-[0_0_10px_#06b6d4]"
                                    : isFog
                                    ? "bg-gray-900/50 border-gray-800 opacity-50"
                                    : "bg-gray-900/80 border-cyan-900/50 hover:bg-cyan-900/30 hover:border-cyan-500/50"
                                }
                            `}
              title={`Sector ${x},${y} ${isFog ? "(Unexplored)" : ""}`}
            >
              {isPlayerHere && (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]" />
              )}
              {!isPlayerHere && !isFog && (
                <span className="text-[8px] text-cyan-900/50 select-none">
                  {x},{y}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400 font-mono">
        <span>
          COORD: X:{playerData.x} Y:{playerData.y}
        </span>
        <span>STATUS: OPERATIONAL</span>
      </div>
    </div>
  );
}
