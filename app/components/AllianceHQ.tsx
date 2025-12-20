"use client";

import { useGame } from "../hooks/useGame";
import { useState } from "react";
import {
  Users,
  ShieldCheck,
  Download,
  PlusSquare,
  ArrowRight,
} from "lucide-react";
import { PublicKey } from "@solana/web3.js";

export default function AllianceHQ() {
  const {
    playerData,
    allianceData,
    createAlliance,
    joinAlliance,
    depositResources,
    loading,
  } = useGame();

  const [createName, setCreateName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [depositWood, setDepositWood] = useState("");
  const [depositIron, setDepositIron] = useState("");

  if (!playerData) return null;
  const isInAlliance = !!allianceData;

  return (
    <div className="bg-black/80 p-6 rounded-xl border border-indigo-500/30 backdrop-blur-md">
      <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
        <Users className="w-5 h-5" /> ALLIANCE HQ
      </h3>

      {isInAlliance && allianceData ? (
        <div className="space-y-6">
          <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-2">
              {allianceData.name}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
              <div>
                <p className="text-gray-500 text-xs uppercase">Members</p>
                <p className="font-mono text-lg">
                  {allianceData.totalMembers.toString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Wood Treasury</p>
                <p className="font-mono text-lg text-emerald-400">
                  {allianceData.woodTreasury.toString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Iron Treasury</p>
                <p className="font-mono text-lg text-amber-500">
                  {allianceData.ironTreasury.toString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h4 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" /> DEPOSIT RESOURCES
            </h4>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Wood Amount"
                value={depositWood}
                onChange={(e) => setDepositWood(e.target.value)}
                className="w-1/2 p-2 bg-black border border-gray-700 rounded text-sm text-white focus:border-indigo-500 outline-none"
              />
              <input
                type="number"
                placeholder="Iron Amount"
                value={depositIron}
                onChange={(e) => setDepositIron(e.target.value)}
                className="w-1/2 p-2 bg-black border border-gray-700 rounded text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={() =>
                depositResources(Number(depositWood), Number(depositIron))
              }
              disabled={loading || (!depositWood && !depositIron)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-bold text-xs uppercase"
            >
              Confirm Transfer
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-800">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <PlusSquare className="w-4 h-4 text-green-400" /> Establish New
              Alliance
            </h4>
            <input
              type="text"
              placeholder="Alliance Name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 rounded text-white mb-4 outline-none focus:border-green-500"
            />
            <button
              onClick={() => createAlliance(createName)}
              disabled={loading || !createName}
              className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold text-xs uppercase"
            >
              Create Alliance
            </button>
          </div>

          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-800">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" /> Join Existing
            </h4>
            <input
              type="text"
              placeholder="Alliance Name"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 rounded text-white mb-4 outline-none focus:border-blue-500"
            />
            <button
              onClick={() => joinAlliance(joinName)}
              disabled={loading || !joinName}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold text-xs uppercase"
            >
              Join Alliance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
