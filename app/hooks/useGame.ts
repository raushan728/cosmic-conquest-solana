import { useEffect, useState, useMemo, useCallback } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, PLAYER_SEED, GAME_SEED } from "../utils/constants";
import idl from "../utils/idl.json";
import { GameEngine } from "../utils/types";

const findPDA = (seeds: Buffer[]) => {
  return PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)[0];
};

export function useGame() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<any>(null);
  const [allianceData, setAllianceData] = useState<any>(null);
  const [gameData, setGameData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const program = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    return new Program<GameEngine>(idl as any, provider);
  }, [connection, wallet]);


  const fetchGameData = useCallback(async () => {
    if (!program) return;
    try {
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      try {
        const account = await program.account.game.fetch(gamePda);
        setGameData(account);
      } catch (e) {
        console.log("Game global not found or created yet.");
      }
    } catch (e) {
      console.error("Failed to fetch game data", e);
    }
  }, [program]);

  const fetchPlayer = useCallback(async () => {
    if (!program || !wallet) return;

    try {
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);

      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const account = await program.account.player.fetch(playerPda);
      setPlayerData(account);
      setIsRegistered(true);

      if (
        account.allianceKey &&
        !account.allianceKey.equals(PublicKey.default)
      ) {
        try {
          if (
            account.allianceKey.toBase58() !==
            web3.SystemProgram.programId.toBase58()
          ) {
            const allianceAccount = await program.account.alliance.fetch(
              account.allianceKey
            );
            setAllianceData(allianceAccount);
          }
        } catch (e) {
          console.log("Alliance fetch failed", e);
        }
      }
    } catch (e) {
      console.log("Player not found (Needs Registration)");
      setPlayerData(null);
      setIsRegistered(false);
    }
  }, [program, wallet]);

  useEffect(() => {
    if (wallet) {
      fetchPlayer();
      fetchGameData();
    }
  }, [wallet, fetchPlayer, fetchGameData]);

  const initGame = async (maxX: number, maxY: number) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);

      const tx = await program.methods
        .initGame(maxX, maxY)
        .accounts({
          game: gamePda,
          admin: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .rpc();

      console.log("Init Game Tx:", tx);
      await fetchGameData();
      alert("Universe Initialized!");
    } catch (error) {
      console.error("Init Game Error:", error);
      alert("Failed to Init Game");
    } finally {
      setLoading(false);
    }
  };

  const initPlayer = async (username: string) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .initPlayer(username)
        .accounts({
          game: gamePda,
          player: playerPda,
          signer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .rpc();

      console.log("Init Player Tx:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Init Player Error:", error);
      alert("Registration Failed (Check Console)");
    } finally {
      setLoading(false);
    }
  };

  const movePlayer = async (newX: number, newY: number) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .movePlayer(newX, newY)
        .accounts({
          game: gamePda,
          player: playerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Move Player Tx:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Move Error:", error);
      alert("Move Failed!");
    } finally {
      setLoading(false);
    }
  };

  const harvestResources = async () => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .harvestResources()
        .accounts({
          player: playerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Harvest Tx:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Harvest Error:", error);
      alert("Harvest Failed");
    } finally {
      setLoading(false);
    }
  };

  const craftItem = async (
    itemType: "titaniumHull" | "laserCannon" | "warpEngine"
  ) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);
      const itemEnum = { [itemType]: {} };

      const tx = await program.methods
        .craftItem(itemEnum as any)
        .accounts({
          player: playerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Craft Tx:", tx);
      await fetchPlayer();
      alert(`Crafted ${itemType} successfully!`);
    } catch (error) {
      console.error("Craft Error:", error);
      alert("Crafting Failed");
    } finally {
      setLoading(false);
    }
  };

  const attackPlayer = async (defenderPubkeyStr: string) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const defenderPubkey = new PublicKey(defenderPubkeyStr);
      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const attackerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);
      const defenderPlayerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        defenderPubkey.toBuffer(),
      ]);

      const tx = await program.methods
        .attackPlayer()
        .accounts({
          attacker: attackerPda,
          defender: defenderPlayerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Attack Tx:", tx);
      await fetchPlayer();
      alert("Attack Successful! Check logs/stats.");
    } catch (error) {
      console.error("Attack Error:", error);
      alert("Attack Failed!");
    } finally {
      setLoading(false);
    }
  };

  const createAlliance = async (name: string) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const alliancePda = findPDA([Buffer.from("alliance"), Buffer.from(name)]);

      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .createAlliance(name)
        .accounts({
          alliance: alliancePda,
          player: playerPda,
          signer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .rpc();

      console.log("Create Alliance Tx:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Create Alliance Error:", error);
      alert("Failed to create alliance.");
    } finally {
      setLoading(false);
    }
  };

  const joinAlliance = async (name: string) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);
      const alliancePda = findPDA([Buffer.from("alliance"), Buffer.from(name)]);

      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .joinAlliance()
        .accounts({
          alliance: alliancePda,
          player: playerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Join Alliance Tx:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Join Alliance Error:", error);
      alert("Failed to join alliance.");
    } finally {
      setLoading(false);
    }
  };

  const depositResources = async (amountWood: number, amountIron: number) => {
    if (!program || !wallet || !playerData?.allianceKey) return;
    try {
      setLoading(true);

      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .depositResources(new BN(amountWood), new BN(amountIron))
        .accounts({
          alliance: playerData.allianceKey,
          player: playerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Deposit Tx:", tx);
      await fetchPlayer();
    } catch (error) {
      console.error("Deposit Error:", error);
      alert("Deposit Failed");
    } finally {
      setLoading(false);
    }
  };

  const claimQuest = async (questId: number) => {
    if (!program || !wallet) return;
    try {
      setLoading(true);

      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .claimQuest(questId)
        .accounts({
          player: playerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Claim Quest Tx:", tx);
      await fetchPlayer();
      alert("Quest Claimed!");
    } catch (error) {
      console.error("Claim Quest Error:", error);
      alert("Failed to claim quest.");
    } finally {
      setLoading(false);
    }
  };

  const buyMysteryBox = async () => {
    if (!program || !wallet) return;
    try {
      setLoading(true);

      const gamePda = findPDA([Buffer.from(GAME_SEED)]);
      const playerPda = findPDA([
        Buffer.from(PLAYER_SEED),
        gamePda.toBuffer(),
        wallet.publicKey.toBuffer(),
      ]);

      const tx = await program.methods
        .buyMysteryBox()
        .accounts({
          player: playerPda,
          signer: wallet.publicKey,
        } as any)
        .rpc();

      console.log("Mystery Box Tx:", tx);
      await fetchPlayer();
      alert("Mystery Box Opened!");
    } catch (error) {
      console.error("Mystery Box Error:", error);
      alert("Failed to buy mystery box.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    playerData,
    allianceData,
    gameData,
    isRegistered,
    initGame,
    initPlayer,
    movePlayer,
    harvestResources,
    craftItem,
    attackPlayer,
    createAlliance,
    joinAlliance,
    depositResources,
    claimQuest,
    buyMysteryBox,
    fetchPlayer,
  };
}
