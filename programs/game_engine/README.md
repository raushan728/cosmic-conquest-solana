# Cosmic Conquest - Solana Program (Game Engine)

This directory contains the on-chain game logic for Cosmic Conquest, built using the [Anchor] framework on [Solana].

[Anchor]: https://www.anchor-lang.com/
[Solana]: https://solana.com/

## Prerequisites

- [Rust] toolchain
- [Solana CLI] v1.18+
- Anchor v0.32.1

[Rust]: https://www.rust-lang.org/
[Solana CLI]: https://docs.solanalabs.com/cli/install

## Quick Start

1. Build the Solana program:
   ```bash
   anchor build
   ```

2. Run the integration tests (ensure you run this from the project root):
   ```bash
   anchor test
   ```

## Game State & Accounts

The engine relies on three core accounts to store data on-chain:

- `Game`: A singleton account tracking global bounds and total player count.
- `Player`: Stores resources (wood, iron, gold, energy), upgrades, grid coordinates, and quest progress.
- `Alliance`: Maintains guild data including a shared treasury for wood and iron.

## Instructions

- `init_game`: Initializes the universe grid dimensions and sets the admin address.
- `init_player`: Derives a new player account and grants starting resources.
- `move_player`: Updates coordinates and deducts energy based on distance and engine level.
- `harvest_resources`: Calculates resource accrual based on elapsed time.
- `attack_player`: Initiates combat, calculating damage and transferring resources if the defender is destroyed.

