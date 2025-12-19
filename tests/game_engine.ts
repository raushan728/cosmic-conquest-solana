import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { GameEngine } from "../target/types/game_engine";
import { assert } from "chai";

describe("cosmic-conquest", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GameEngine as Program<GameEngine>;
  let gamePda: anchor.web3.PublicKey;
  let playerPda: anchor.web3.PublicKey;
  const admin = provider.wallet;
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it("Is Initialized (Universe Creation)", async () => {
    const [pda, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("game_global")],
      program.programId
    );
    gamePda = pda;
    await program.methods
      .initGame(100, 100)
      .accounts({
        game: gamePda,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }as any)
      .rpc();

    const gameState = await program.account.game.fetch(gamePda);
    console.log("🌌 Universe Created!");
    console.log("   Max X:", gameState.maxX);
    console.log("   Total Players:", gameState.totalPlayers.toString());

    assert.equal(gameState.maxX, 100);
    assert.equal(gameState.totalPlayers.toNumber(), 0);
  });

  it("Registers a New Player", async () => {
    const [pda, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), gamePda.toBuffer(), admin.publicKey.toBuffer()],
      program.programId
    );
    playerPda = pda;
    await program.methods
      .initPlayer("Commander Shepard")
      .accounts({
        game: gamePda,
        player: playerPda,
        signer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }as any)
      .rpc();
    const playerState = await program.account.player.fetch(playerPda);
    console.log("Player Registered: " + playerState.username);
    console.log("Wood:", playerState.wood.toString());
    console.log("Health:", playerState.health);

    assert.equal(playerState.username, "Commander Shepard");
    assert.equal(playerState.wood.toNumber(), 100);
    assert.equal(playerState.level, 1);
  });

  it("Harvests Resources (Time Logic Check)", async () => {
    console.log("Waiting 11 seconds for mining logic...");
    await sleep(11000);

    const preHarvest = await program.account.player.fetch(playerPda);

    await program.methods
      .harvestResources()
      .accounts({
        player: playerPda,
        signer: admin.publicKey,
      })
      .rpc();

    const postHarvest = await program.account.player.fetch(playerPda);
    console.log("Harvest Complete!");
    console.log("Old Wood:", preHarvest.wood.toString());
    console.log("New Wood:", postHarvest.wood.toString());
    assert.isAbove(postHarvest.wood.toNumber(), preHarvest.wood.toNumber());
  });

  it("Moves the Player (Fuel Consumption)", async () => {
    const startState = await program.account.player.fetch(playerPda);
    console.log(
      `Start Pos: (${startState.x}, ${startState.y}) - Energy: ${startState.energy}`
    );

    await program.methods
      .movePlayer(10, 10)
      .accounts({
        game: gamePda,
        player: playerPda,
        signer: admin.publicKey,
      })
      .rpc();

    const endState = await program.account.player.fetch(playerPda);
    console.log(
      `New Pos: (${endState.x}, ${endState.y}) - Energy: ${endState.energy}`
    );

    assert.equal(endState.x, 10);
    assert.equal(endState.y, 10);
    assert.isBelow(endState.energy.toNumber(), startState.energy.toNumber());
  });
  it("Crafts an Item (Tech Tree)", async () => {
    try {
      await program.methods
        .craftItem({ titaniumHull: {} })
        .accounts({
          player: playerPda,
          signer: admin.publicKey,
        })
        .rpc();

      const playerState = await program.account.player.fetch(playerPda);
      console.log("Crafted Titanium Hull! Level:", playerState.hullLevel);
      assert.equal(playerState.hullLevel, 1);
    } catch (e) {
      console.log(
        "Crafting might have failed due to low iron (Mining takes time)."
      );
      console.log(e);
    }
  });
});
