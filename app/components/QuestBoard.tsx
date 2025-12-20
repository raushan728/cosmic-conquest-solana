"use client";

import { useGame } from "../hooks/useGame";
import { Scroll, Gift, Lock, CheckCircle } from "lucide-react";

export default function QuestBoard() {
  const { playerData, claimQuest, buyMysteryBox, loading } = useGame();

  if (!playerData) return null;
  const quests = [
    {
      id: 1,
      title: "Resource Miner",
      desc: "Harvest 100 Resources today.",
      reward: "50 XP, 20 Gold",
      progress: Math.min(Number(playerData.dailyMined), 100),
      goal: 100,
      completed: Number(playerData.dailyMined) >= 100,
    },
    {
      id: 2,
      title: "Space Warlord",
      desc: "Win 3 Battles today.",
      reward: "100 XP, 1 Mystery Box",
      progress: Math.min(Number(playerData.dailyBattles), 3),
      goal: 3,
      completed: Number(playerData.dailyBattles) >= 3,
    },
  ];

  return (
    <div className="bg-black/80 p-6 rounded-xl border border-yellow-500/30 backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
          <Scroll className="w-5 h-5" /> MISSIONS
        </h3>
        <div className="bg-yellow-900/20 px-3 py-1 rounded border border-yellow-500/30 text-xs text-yellow-200">
          Daily Reset: 00:00 UTC
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex justify-between items-center group hover:border-yellow-500/50 transition-all"
          >
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">{quest.title}</h4>
              <p className="text-xs text-gray-400 mb-2">{quest.desc}</p>
              <p className="text-xs text-yellow-500/80">
                Reward: {quest.reward}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right text-xs font-mono text-gray-300">
                {quest.progress} / {quest.goal}
              </div>
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                ></div>
              </div>

              <button
                onClick={() => claimQuest(quest.id)}
                disabled={!quest.completed || loading}
                className={`
                                    px-4 py-1 rounded text-xs font-bold uppercase
                                    ${
                                      quest.completed
                                        ? "bg-yellow-600 hover:bg-yellow-500 text-black cursor-pointer animate-pulse"
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    }
                                `}
              >
                {quest.completed ? "Multi-Pass Claim" : "Locked"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mystery Box Section */}
      <div className="mt-8 border-t border-gray-800 pt-6">
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-purple-500/30 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-all"></div>
          <Gift className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-white mb-2">MYSTERY CACHE</h3>
          <p className="text-sm text-purple-200 mb-6">
            Contains random resources or rare artifacts.
          </p>

          <button
            onClick={() => buyMysteryBox()}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.7)] transition-all transform hover:scale-105"
          >
            OPEN FOR 5 GOLD
          </button>
        </div>
      </div>
    </div>
  );
}
