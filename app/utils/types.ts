/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/game_engine.json`.
 */
export type GameEngine = {
  "address": "9yXJnsBoXjtymPsBmAesDcDZTh7M2RPfataHbi8Rsxip",
  "metadata": {
    "name": "gameEngine",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "attackPlayer",
      "discriminator": [
        204,
        207,
        73,
        170,
        216,
        244,
        173,
        255
      ],
      "accounts": [
        {
          "name": "attacker",
          "writable": true
        },
        {
          "name": "defender",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "buyMysteryBox",
      "discriminator": [
        150,
        161,
        180,
        220,
        54,
        128,
        128,
        242
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "claimQuest",
      "discriminator": [
        38,
        197,
        33,
        123,
        0,
        108,
        206,
        161
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "questId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "craftItem",
      "discriminator": [
        196,
        249,
        129,
        219,
        148,
        234,
        223,
        222
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "item",
          "type": {
            "defined": {
              "name": "itemType"
            }
          }
        }
      ]
    },
    {
      "name": "createAlliance",
      "discriminator": [
        201,
        92,
        183,
        64,
        131,
        82,
        174,
        203
      ],
      "accounts": [
        {
          "name": "alliance",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  108,
                  105,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositResources",
      "discriminator": [
        86,
        149,
        243,
        159,
        58,
        9,
        191,
        226
      ],
      "accounts": [
        {
          "name": "alliance",
          "writable": true
        },
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "amountWood",
          "type": "u64"
        },
        {
          "name": "amountIron",
          "type": "u64"
        }
      ]
    },
    {
      "name": "harvestResources",
      "discriminator": [
        232,
        189,
        237,
        198,
        103,
        127,
        115,
        57
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initGame",
      "discriminator": [
        251,
        46,
        12,
        208,
        184,
        148,
        157,
        73
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "maxX",
          "type": "u32"
        },
        {
          "name": "maxY",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initPlayer",
      "discriminator": [
        114,
        27,
        219,
        144,
        50,
        15,
        228,
        66
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "joinAlliance",
      "discriminator": [
        237,
        35,
        212,
        158,
        181,
        98,
        153,
        166
      ],
      "accounts": [
        {
          "name": "alliance",
          "writable": true
        },
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "movePlayer",
      "discriminator": [
        17,
        58,
        68,
        221,
        186,
        117,
        140,
        231
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "player",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newX",
          "type": "u32"
        },
        {
          "name": "newY",
          "type": "u32"
        }
      ]
    },
    {
      "name": "toggleGameState",
      "discriminator": [
        191,
        65,
        244,
        241,
        155,
        217,
        85,
        167
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "game"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "alliance",
      "discriminator": [
        80,
        135,
        160,
        6,
        114,
        44,
        211,
        15
      ]
    },
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    },
    {
      "name": "player",
      "discriminator": [
        205,
        222,
        112,
        7,
        165,
        155,
        206,
        218
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "usernameTooLong",
      "msg": "Username cannot be more than 20 characters."
    },
    {
      "code": 6001,
      "name": "outOfBounds",
      "msg": "Coordinates are out of bounds."
    },
    {
      "code": 6002,
      "name": "insufficientFunds",
      "msg": "Not enough resources."
    },
    {
      "code": 6003,
      "name": "notEnoughEnergy",
      "msg": "You don't have enough energy to travel that far."
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "You are not the owner of this player account."
    },
    {
      "code": 6005,
      "name": "harvestTooSoon",
      "msg": "Wait at least 10 seconds between harvests."
    },
    {
      "code": 6006,
      "name": "cannotAttackSelf",
      "msg": "You cannot attack yourself."
    },
    {
      "code": 6007,
      "name": "targetOutOfRange",
      "msg": "Target is too far away. Move closer."
    },
    {
      "code": 6008,
      "name": "nameTooLong",
      "msg": "Alliance name is too long."
    },
    {
      "code": 6009,
      "name": "alreadyInAlliance",
      "msg": "You are already in an alliance."
    },
    {
      "code": 6010,
      "name": "allianceFull",
      "msg": "This alliance is full."
    },
    {
      "code": 6011,
      "name": "notInThisAlliance",
      "msg": "You are not a member of this alliance."
    },
    {
      "code": 6012,
      "name": "maxLevelReached",
      "msg": "Maximum upgrade level reached."
    },
    {
      "code": 6013,
      "name": "questNotCompleted",
      "msg": "Quest requirements not met."
    },
    {
      "code": 6014,
      "name": "rewardAlreadyClaimed",
      "msg": "Reward already claimed for today."
    },
    {
      "code": 6015,
      "name": "invalidQuestId",
      "msg": "Invalid Quest ID."
    }
  ],
  "types": [
    {
      "name": "alliance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "leader",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "totalMembers",
            "type": "u64"
          },
          {
            "name": "woodTreasury",
            "type": "u64"
          },
          {
            "name": "ironTreasury",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "totalPlayers",
            "type": "u64"
          },
          {
            "name": "maxX",
            "type": "u32"
          },
          {
            "name": "maxY",
            "type": "u32"
          },
          {
            "name": "isPaused",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "itemType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "titaniumHull"
          },
          {
            "name": "laserCannon"
          },
          {
            "name": "warpEngine"
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "allianceKey",
            "type": "pubkey"
          },
          {
            "name": "wood",
            "type": "u64"
          },
          {
            "name": "iron",
            "type": "u64"
          },
          {
            "name": "gold",
            "type": "u64"
          },
          {
            "name": "energy",
            "type": "u64"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "xp",
            "type": "u64"
          },
          {
            "name": "health",
            "type": "u8"
          },
          {
            "name": "x",
            "type": "u32"
          },
          {
            "name": "y",
            "type": "u32"
          },
          {
            "name": "lastLogin",
            "type": "i64"
          },
          {
            "name": "hullLevel",
            "type": "u8"
          },
          {
            "name": "cannonLevel",
            "type": "u8"
          },
          {
            "name": "engineLevel",
            "type": "u8"
          },
          {
            "name": "totalBattlesWon",
            "type": "u64"
          },
          {
            "name": "dailyMined",
            "type": "u64"
          },
          {
            "name": "dailyBattles",
            "type": "u64"
          },
          {
            "name": "lastQuestReset",
            "type": "i64"
          },
          {
            "name": "questFlags",
            "type": "u8"
          },
          {
            "name": "achievements",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
