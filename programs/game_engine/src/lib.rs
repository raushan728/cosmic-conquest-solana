use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ItemType {
    TitaniumHull,
    LaserCannon,
    WarpEngine,
}
const QUEST_GOAL_MINE: u64 = 100;
const QUEST_GOAL_BATTLE: u64 = 5;
const REWARD_XP: u64 = 50;

declare_id!("9yXJnsBoXjtymPsBmAesDcDZTh7M2RPfataHbi8Rsxip");

#[program]
pub mod game_engine {
    use super::*;

    pub fn init_game(ctx: Context<InitGame>, max_x: u32, max_y: u32) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.admin = *ctx.accounts.admin.key;
        game.max_x = max_x;
        game.max_y = max_y;
        game.total_players = 0;
        game.game_id = 1;
        game.is_paused = false;
        msg!("Universe Created! Max Bounds: {}x{}", max_x, max_y);
        Ok(())
    }

    pub fn init_player(ctx: Context<InitPlayer>, username: String) -> Result<()> {
        require!(username.len() <= 20, GameError::UsernameTooLong);

        let player = &mut ctx.accounts.player;
        player.owner = *ctx.accounts.signer.key;
        player.username = username;
        player.alliance_key = Pubkey::default();
        player.wood = 100;
        player.hull_level = 0;
        player.cannon_level = 0;
        player.engine_level = 0;
        player.iron = 50;
        player.gold = 10;
        player.energy = 100;
        player.level = 1;
        player.xp = 0;
        player.health = 100;
        player.total_battles_won = 0;
        player.daily_mined = 0;
        player.daily_battles = 0;
        player.last_quest_reset = Clock::get()?.unix_timestamp;
        player.quest_flags = 0;
        player.achievements = 0;
        player.last_login = Clock::get()?.unix_timestamp;
        let game = &mut ctx.accounts.game;
        game.total_players += 1;
        msg!(
            "Welcome Commander {} to the Cosmic Conquest!",
            player.username
        );
        Ok(())
    }
    pub fn buy_mystery_box(ctx: Context<BuyBox>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        if player.gold < 5 {
            return err!(GameError::InsufficientFunds);
        }
        player.gold -= 5;
        let clock = Clock::get()?;
        let seed = (clock.unix_timestamp as u64)
            .wrapping_add(player.xp)
            .wrapping_add(player.wood);

        let roll = seed % 100;

        if roll < 50 {
            let amount = 200;
            player.wood += amount;
            msg!("Common Loot: +{} Wood", amount);
        } else if roll < 80 {
            let amount = 100;
            player.iron += amount;
            msg!("Uncommon Loot: +{} Iron", amount);
        } else if roll < 95 {
            player.energy = 100;
            msg!("Rare Loot: Energy Fully Restored!");
        } else {
            if player.hull_level < 10 {
                player.hull_level += 1;
                player.health += 10;
                msg!("LEGENDARY! Free Hull Upgrade!");
            } else {
                player.gold += 20;
                msg!("LEGENDARY! +20 Gold Cashback!");
            }
        }

        Ok(())
    }
    pub fn claim_quest(ctx: Context<ClaimQuest>, quest_id: u8) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        if current_time - player.last_quest_reset > 86400 {
            player.daily_mined = 0;
            player.daily_battles = 0;
            player.quest_flags = 0;
            player.last_quest_reset = current_time;
            msg!("Daily Quests have been reset!");
            return Ok(());
        }
        match quest_id {
            1 => {
                if player.daily_mined < QUEST_GOAL_MINE {
                    return err!(GameError::QuestNotCompleted);
                }
                if (player.quest_flags & 1) != 0 {
                    return err!(GameError::RewardAlreadyClaimed);
                }
                player.wood += 50;
                player.xp += REWARD_XP;
                player.quest_flags |= 1;
                msg!("Quest Completed: The Miner! +50 Wood, +XP");
            }
            2 => {
                if player.daily_battles < QUEST_GOAL_BATTLE {
                    return err!(GameError::QuestNotCompleted);
                }
                if (player.quest_flags & 2) != 0 {
                    return err!(GameError::RewardAlreadyClaimed);
                }
                player.iron += 30;
                player.xp += REWARD_XP * 2;

                player.quest_flags |= 2;
                msg!("Quest Completed: The Warlord! +30 Iron, +XP");
            }
            _ => return err!(GameError::InvalidQuestId),
        }

        Ok(())
    }
    pub fn move_player(ctx: Context<MovePlayer>, new_x: u32, new_y: u32) -> Result<()> {
        let game = &ctx.accounts.game;
        let player = &mut ctx.accounts.player;

        if new_x > game.max_x || new_y > game.max_y {
            return err!(GameError::OutOfBounds);
        }
        let dx = (player.x as i64 - new_x as i64).abs();
        let dy = (player.y as i64 - new_y as i64).abs();
        let distance = dx + dy;
        // let fuel_needed = (distance as u64) * 2;
        let base_cost = (distance as u64) * 2;
        let discount = (base_cost * player.engine_level as u64) / 10;
        let fuel_needed = if base_cost > discount {
            base_cost - discount
        } else {
            1
        };
        if player.energy < fuel_needed {
            return err!(GameError::NotEnoughEnergy);
        }
        player.energy -= fuel_needed;
        player.x = new_x;
        player.y = new_y;

        msg!(
            "Player moved to ({}, {}). Fuel burned: {}",
            new_x,
            new_y,
            fuel_needed
        );
        Ok(())
    }
    pub fn harvest_resources(ctx: Context<HarvestResources>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        let time_diff = current_time - player.last_login;

        if time_diff < 10 {
            return err!(GameError::HarvestTooSoon);
        }
        let wood_earned = time_diff as u64;
        let iron_earned = time_diff as u64 / 2;

        player.wood += wood_earned;
        player.iron += iron_earned;
        player.daily_mined += wood_earned + iron_earned;
        if player.wood >= 1000 && (player.achievements & 2 == 0) {
            player.achievements |= 2;
            msg!("ACHIEVEMENT UNLOCKED: Resource Hoarder!");
        }

        player.last_login = current_time;

        if player.energy < 100 {
            player.energy += 5;
        }

        msg!("Harvested! +{} Wood, +{} Iron", wood_earned, iron_earned);
        Ok(())
    }

    pub fn attack_player(ctx: Context<AttackPlayer>) -> Result<()> {
        let attacker = &mut ctx.accounts.attacker;
        let defender = &mut ctx.accounts.defender;

        if attacker.key() == defender.key() {
            return err!(GameError::CannotAttackSelf);
        }

        if attacker.energy < 10 {
            return err!(GameError::NotEnoughEnergy);
        }

        let dx = (attacker.x as i64 - defender.x as i64).abs();
        let dy = (attacker.y as i64 - defender.y as i64).abs();
        if dx + dy > 5 {
            return err!(GameError::TargetOutOfRange);
        }

        let clock = Clock::get()?;
        let pseudo_random = (clock.unix_timestamp as u64)
            .wrapping_add(clock.slot)
            .wrapping_add(attacker.xp);
        let randomness = (pseudo_random % 10) as u8;

        let attack_power = 10 + (attacker.level * 2) + (attacker.cannon_level * 5);
        let defense_power = defender.hull_level * 3;

        let raw_damage = attack_power + randomness;
        let damage = if raw_damage > defense_power {
            raw_damage - defense_power
        } else {
            1
        };

        if defender.health <= damage {
            msg!("Target Destroyed! Looting resources...");

            let stolen_wood = defender.wood / 2;
            let stolen_iron = defender.iron / 2;

            defender.wood -= stolen_wood;
            defender.iron -= stolen_iron;

            defender.health = 100;
            defender.level = 1;
            defender.xp = 0;
            defender.x = (pseudo_random % 100) as u32;
            defender.y = ((pseudo_random >> 2) % 100) as u32;

            attacker.wood += stolen_wood;
            attacker.iron += stolen_iron;
            attacker.xp += 50;
            attacker.total_battles_won += 1;
            attacker.daily_battles += 1;
            if attacker.achievements & 1 == 0 {
                attacker.achievements |= 1;
                msg!("ACHIEVEMENT UNLOCKED: First Blood!");
            }

            msg!("You stole {} Wood and {} Iron!", stolen_wood, stolen_iron);
        } else {
            defender.health -= damage;
            attacker.xp += 5;

            msg!(
                "Hit! Dealt {} damage. Target HP: {}",
                damage,
                defender.health
            );
        }

        attacker.energy -= 10;
        Ok(())
    }

    pub fn toggle_game_state(ctx: Context<AdminOnly>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.is_paused = !game.is_paused;

        if game.is_paused {
            msg!("GAME PAUSED BY ADMIN. No actions allowed.");
        } else {
            msg!("GAME RESUMED. Go conquer!");
        }
        Ok(())
    }
    pub fn create_alliance(ctx: Context<CreateAlliance>, name: String) -> Result<()> {
        require!(name.len() <= 20, GameError::NameTooLong);

        let alliance = &mut ctx.accounts.alliance;
        let player = &mut ctx.accounts.player;
        if player.alliance_key != Pubkey::default() {
            return err!(GameError::AlreadyInAlliance);
        }
        alliance.leader = *ctx.accounts.signer.key;
        alliance.name = name;
        alliance.total_members = 1;
        alliance.wood_treasury = 0;
        alliance.iron_treasury = 0;
        player.alliance_key = alliance.key();

        msg!("Alliance Created: {}", alliance.name);
        Ok(())
    }
    pub fn join_alliance(ctx: Context<JoinAlliance>) -> Result<()> {
        let alliance = &mut ctx.accounts.alliance;
        let player = &mut ctx.accounts.player;
        if player.alliance_key != Pubkey::default() {
            return err!(GameError::AlreadyInAlliance);
        }
        if alliance.total_members >= 50 {
            return err!(GameError::AllianceFull);
        }
        alliance.total_members += 1;
        player.alliance_key = alliance.key();

        msg!("Player joined alliance: {}", alliance.name);
        Ok(())
    }
    pub fn deposit_resources(
        ctx: Context<DepositResources>,
        amount_wood: u64,
        amount_iron: u64,
    ) -> Result<()> {
        let alliance = &mut ctx.accounts.alliance;
        let player = &mut ctx.accounts.player;
        if player.alliance_key != alliance.key() {
            return err!(GameError::NotInThisAlliance);
        }
        if player.wood < amount_wood || player.iron < amount_iron {
            return err!(GameError::InsufficientFunds);
        }
        player.wood -= amount_wood;
        player.iron -= amount_iron;

        alliance.wood_treasury += amount_wood;
        alliance.iron_treasury += amount_iron;

        msg!(
            "Deposited: {} Wood, {} Iron to Vault.",
            amount_wood,
            amount_iron
        );
        Ok(())
    }
    pub fn craft_item(ctx: Context<CraftItem>, item: ItemType) -> Result<()> {
        let player = &mut ctx.accounts.player;

        let (wood_cost, iron_cost, current_level) = match item {
            ItemType::TitaniumHull => (
                50 * (player.hull_level as u64 + 1),
                20 * (player.hull_level as u64 + 1),
                player.hull_level,
            ),
            ItemType::LaserCannon => (
                80 * (player.cannon_level as u64 + 1),
                40 * (player.cannon_level as u64 + 1),
                player.cannon_level,
            ),
            ItemType::WarpEngine => (
                100 * (player.engine_level as u64 + 1),
                100 * (player.engine_level as u64 + 1),
                player.engine_level,
            ),
        };
        if current_level >= 10 {
            return err!(GameError::MaxLevelReached);
        }
        if player.wood < wood_cost || player.iron < iron_cost {
            return err!(GameError::InsufficientFunds);
        }
        player.wood -= wood_cost;
        player.iron -= iron_cost;
        match item {
            ItemType::TitaniumHull => {
                player.hull_level += 1;
                player.health = 100 + (player.hull_level * 10);
            }
            ItemType::LaserCannon => {
                player.cannon_level += 1;
            }
            ItemType::WarpEngine => {
                player.engine_level += 1;
            }
        }

        msg!(
            "Upgrade Successful! Used {} Wood, {} Iron.",
            wood_cost,
            iron_cost
        );
        Ok(())
    }
}

#[account]
pub struct Game {
    pub admin: Pubkey,
    pub game_id: u64,
    pub total_players: u64,
    pub max_x: u32,
    pub max_y: u32,
    pub is_paused: bool,
}

#[account]
pub struct Player {
    pub owner: Pubkey,
    pub username: String,
    pub alliance_key: Pubkey,
    pub wood: u64,
    pub iron: u64,
    pub gold: u64,
    pub energy: u64,
    pub level: u8,
    pub xp: u64,
    pub health: u8,
    pub x: u32,
    pub y: u32,
    pub last_login: i64,
    pub hull_level: u8,
    pub cannon_level: u8,
    pub engine_level: u8,
    pub total_battles_won: u64,
    pub daily_mined: u64,
    pub daily_battles: u64,
    pub last_quest_reset: i64,
    pub quest_flags: u8,
    pub achievements: u8,
}
#[account]
pub struct Alliance {
    pub leader: Pubkey,
    pub name: String,
    pub total_members: u64,
    pub wood_treasury: u64,
    pub iron_treasury: u64,
}
#[derive(Accounts)]
pub struct BuyBox<'info> {
    #[account(
        mut,
        constraint = player.owner == *signer.key
    )]
    pub player: Account<'info, Player>,
    pub signer: Signer<'info>,
}
#[derive(Accounts)]
pub struct AdminOnly<'info> {
    #[account(
        mut,
        has_one = admin
    )]
    pub game: Account<'info, Game>,
    pub admin: Signer<'info>,
}
#[derive(Accounts)]
pub struct CraftItem<'info> {
    #[account(
        mut,
        constraint = player.owner == *signer.key @ GameError::Unauthorized
    )]
    pub player: Account<'info, Player>,
    pub signer: Signer<'info>,
}
#[derive(Accounts)]
pub struct ClaimQuest<'info> {
    #[account(
        mut,
        constraint = player.owner == *signer.key @ GameError::Unauthorized
    )]
    pub player: Account<'info, Player>,
    pub signer: Signer<'info>,
}
#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateAlliance<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 32 + (4 + 20) + 8 + 8 + 8,
        seeds = [b"alliance", name.as_bytes()],
        bump
    )]
    pub alliance: Account<'info, Alliance>,

    #[account(mut)]
    pub player: Account<'info, Player>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinAlliance<'info> {
    #[account(mut)]
    pub alliance: Account<'info, Alliance>,
    #[account(mut)]
    pub player: Account<'info, Player>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct DepositResources<'info> {
    #[account(mut)]
    pub alliance: Account<'info, Alliance>,
    #[account(
        mut,
        constraint = player.owner == *signer.key
    )]
    pub player: Account<'info, Player>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct AttackPlayer<'info> {
    #[account(
        mut,
        constraint = attacker.owner == *signer.key @ GameError::Unauthorized
    )]
    pub attacker: Account<'info, Player>,

    #[account(mut)]
    pub defender: Account<'info, Player>,

    pub signer: Signer<'info>,
}
#[derive(Accounts)]
pub struct InitGame<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 8 + 4 + 4 + 50,
        seeds = [b"game_global"],
        bump
    )]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitPlayer<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = signer,
        space = 8 + 32 + 24 + 32 + 100,
        seeds = [b"player", game.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct MovePlayer<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(
        mut,
        constraint = player.owner == *signer.key @ GameError::Unauthorized
    )]
    pub player: Account<'info, Player>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct HarvestResources<'info> {
    #[account(
        mut,
        constraint = player.owner == *signer.key @ GameError::Unauthorized
    )]
    pub player: Account<'info, Player>,
    pub signer: Signer<'info>,
}

#[error_code]
pub enum GameError {
    #[msg("Username cannot be more than 20 characters.")]
    UsernameTooLong,
    #[msg("Coordinates are out of bounds.")]
    OutOfBounds,
    #[msg("Not enough resources.")]
    InsufficientFunds,
    #[msg("You don't have enough energy to travel that far.")]
    NotEnoughEnergy,
    #[msg("You are not the owner of this player account.")]
    Unauthorized,
    #[msg("Wait at least 10 seconds between harvests.")]
    HarvestTooSoon,
    #[msg("You cannot attack yourself.")]
    CannotAttackSelf,
    #[msg("Target is too far away. Move closer.")]
    TargetOutOfRange,
    #[msg("Alliance name is too long.")]
    NameTooLong,
    #[msg("You are already in an alliance.")]
    AlreadyInAlliance,
    #[msg("This alliance is full.")]
    AllianceFull,
    #[msg("You are not a member of this alliance.")]
    NotInThisAlliance,
    #[msg("Maximum upgrade level reached.")]
    MaxLevelReached,
    #[msg("Quest requirements not met.")]
    QuestNotCompleted,
    #[msg("Reward already claimed for today.")]
    RewardAlreadyClaimed,
    #[msg("Invalid Quest ID.")]
    InvalidQuestId,
}
