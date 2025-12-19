import { useEffect, useState, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, PLAYER_SEED } from "../utils/constants";
import idl from "../utils/idl.json";
import { GameEngine } from "../utils/types";

export function useGame() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const program = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, {});
    return new Program<GameEngine>(idl as any, provider);
  }, [connection, wallet]);
  const fetchPlayer = async () => {
    if (!program || !wallet) return;

    try {
      setLoading(true);
      const [playerPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(PLAYER_SEED),
          PROGRAM_ID.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        PROGRAM_ID
      );

      const account = await program.account.player.fetch(playerPda);
      setPlayerData(account);
      setIsRegistered(true);
      console.log("Player Data Loaded:", account);
    } catch (e) {
      console.log("Player not found (Needs Registration)");
      setPlayerData(null);
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchPlayer();
    }
  }, [wallet, program]);

  const initGame = async () => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const [gamePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("game_global")],
        PROGRAM_ID
      );

      console.log("Initializing Universe at:", gamePda.toBase58());

      const tx = await program.methods
        .initGame(100, 100)
        .accounts({
          game: gamePda,
          admin: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .rpc();

      console.log("Universe Created! Tx:", tx);
      alert("Universe Initialized! Ab Player Register karo.");
    } catch (error) {
      console.error("Init Game Error:", error);
      alert("Failed to Init Game (Check Console)");
    } finally {
      setLoading(false);
    }
  };
  const initPlayer = async (username: string) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);

      const [gamePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("game_global")],
        PROGRAM_ID
      );

      const [playerPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(PLAYER_SEED),
          PROGRAM_ID.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        PROGRAM_ID
      );
      const tx = await program.methods
        .initPlayer(username)
        .accounts({
          game: gamePda,
        } as any)
        .rpc();

      console.log("Tx Signature:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Init Error:", error);
      alert("Registration Failed! Check console.");
    } finally {
      setLoading(false);
    }
  };

  const harvestResources = async () => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const tx = await program.methods
        .harvestResources()
        .accounts({} as any)
        .rpc();
      console.log("Harvest Tx:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Harvest Error:", error);
      alert("Harvest Failed! Too soon?");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    playerData,
    isRegistered,
    initPlayer,
    harvestResources,
    fetchPlayer,
    initGame,
  };
}
