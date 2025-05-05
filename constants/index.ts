export const StakeModule = {
    MODULE_NAME: "stake",
    FUNCTIONS: {
      STAKE: "stake",
      UNSTAKE: "unstake",
      // TODO: Add claim_rewards function if implemented
      // TODO: Add calculate_pending_rewards function if it's public and needed externally
    },
    STRUCT: {
      STAKE_INFO: "StakeInfo",
      STAKE_POOL: "StakePool",
    },
    EVENTS: {
      STAKED: "StakedEvent",
      UNSTAKED: "UnstakedEvent",
    }
  } as const;
  
  // yield_token 模块常量
  export const YieldTokenModule = {
    MODULE_NAME: "yield_token",
    FUNCTIONS: {
      CREATE_YIELD_TOKEN_INFO: "create_yield_token_info",
      MINT: "mint",
      PURCHASE_YIELD_TOKEN: "purchase_yield_token"
    },
    STRUCT: {
      YIELD_TOKEN_MANAGER: "YieldTokenManager",
      YIELD_TOKEN_INFO: "YieldTokenInfo",
    },
    // No public events defined in this module
    EVENTS: {}
  } as const;
  
  // rwas 模块常量
  export const RWASModule = {
    MODULE_NAME: "rwas",
    FUNCTIONS: {
      // The init function is typically not called directly by users
      // test_mint is an entry function, but might only be for testing
      TEST_MINT: "test_mint", // Include if this is intended for external use
    },
    STRUCT: {
      RWAS: "RWAS", // The coin type struct
    },
    // No public events defined in this module
    EVENTS: {}
  } as const;
  
  // You can also include the CoinType and Clock constants you provided
  export const CoinType = {
    SUI: "0x2::sui::SUI",
    USDC: {
      TESTNET:
        "0x6c6522852b4a8a36497eec262a0ee46872fcf69718f15e4a99050794d7ff7117::usdc::USDC",
      MAINNET:
        "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
    },
    RWAS: "0x6c6522852b4a8a36497eec262a0ee46872fcf69718f15e4a99050794d7ff7117::rwas::RWAS", // Add RWAS coin type
    YIELD_TOKEN: {
      PALM: "0x3273ac789deb8d84b487a9f387f99399facd1963f45ea51e298bab93b9188989::palm::PALM",
    },
  } as const;
  
  // 时钟对象
  export const Clock = "0x6";