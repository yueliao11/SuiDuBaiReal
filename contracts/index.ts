import { networkConfig, suiClient } from "@/config";
import { Transaction } from "@mysten/sui/transactions";
import { StakePool } from "../type";
import {
  SuiObjectResponse,
  SuiParsedData,
  SuiObjectData,
} from "@mysten/sui/client";
import {StakeModule, YieldTokenModule, CoinType, Clock} from "../constants/index"


export const queryBalance = async (address: string) => {
    console.log(address);
    const result = await suiClient.getBalance({
      coinType: CoinType.RWAS,
      owner: address,
    });
    console.log(result.totalBalance);
    return result;
  };

  export const queryUsdcBalance = async (address: string) => {
    console.log(address);
    const result = await suiClient.getBalance({
      coinType: CoinType.USDC.TESTNET,
      owner: address,
    });
    console.log("usdc_balance", result.totalBalance);
    return result;
  };

export const queryAllCoin = async (address: string, type: string) => {
    let cursor: string | null | undefined = null;
    let hasNextPage = true;
    const coinArr = [];
  
    while (hasNextPage) {
      const coinObjects = await suiClient.getCoins({
        owner: address,
        coinType: type,
        cursor,
        limit: 50,
      });
      if (!coinObjects?.data) {
        break;
      }
      hasNextPage = coinObjects.hasNextPage;
      cursor = coinObjects.nextCursor;
      coinArr.push(...coinObjects.data);
    }
    return coinArr;
  };
  

  // query stakePoolInfo object 
export const queryStakePoolInfo = async () => {
  const stakePoolInfoContent = await suiClient.getObject({
    id: networkConfig.testnet.StakePool,
    options: {
      showContent: true,
    },
  });

  if (!stakePoolInfoContent.data?.content) {
    throw new Error("StakePool content not found");
  }

  const parsedStakePool = stakePoolInfoContent.data.content as SuiParsedData;
  if (!("fields" in parsedStakePool)) {
    throw new Error("Invalid stake_pool data structure");
  }

  const stake_pool = parsedStakePool.fields as unknown as StakePool;
  if (!stake_pool) {
    throw new Error("Invalid stake_pool data structure");
  }

  return stake_pool;
}


// query user_stake_info amount
export const queryUserStakeInfoAmount = async (user_address: string):Promise<any> => {
  const tx = new Transaction();
  // 配置查询call
  tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: StakeModule.MODULE_NAME,
      function: StakeModule.VIEW_FUNCTIONS.GET_USER_STAKEN_AMOUNT,
      arguments: [
          tx.object(networkConfig.testnet.StakePool),
          tx.pure.address(user_address)
      ],
  });

  // 执行检查
  const txDetails = await suiClient.devInspectTransactionBlock({
    sender: user_address,
    transactionBlock: tx,
  });
  
  return txDetails;
}


export const stake = async(
  user_address: string,
  amount: number
) => {
    const result = await queryBalance(user_address);
    if (Number(result.totalBalance) < amount) {
      throw new Error("RWAS is not enough");
    }
    const tx = new Transaction();
    const rwas_coins = await queryAllCoin(user_address, CoinType.RWAS);
    // 初始化为第一个Coin，然后逐步merge剩余的
    rwas_coins.forEach((item) => {
      if (item.coinObjectId !== rwas_coins[0].coinObjectId) {
        tx.mergeCoins(tx.object(rwas_coins[0].coinObjectId), [
          tx.object(item.coinObjectId),
        ]);
      }
    });
    const [rwas] = tx.splitCoins(tx.object(rwas_coins[0].coinObjectId), [tx.pure.u64(amount)]);
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: StakeModule.MODULE_NAME,
        function: StakeModule.FUNCTIONS.STAKE,
        arguments: [
            tx.object(networkConfig.testnet.StakePool),
            rwas,
            tx.object(Clock)
        ],
    });
    return tx;
}

export const mint = async(
    amount: number,
    recipient_address: string
) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: YieldTokenModule.MODULE_NAME,
        function: YieldTokenModule.FUNCTIONS.MINT,
        typeArguments: [CoinType.YIELD_TOKEN.PALM],
        arguments: [
            tx.object(networkConfig.testnet.AdminCap),
            tx.object(networkConfig.testnet.YieldTokenInfo),
            tx.pure.u64(amount),
            tx.pure.address(recipient_address)
        ],
    });
    return tx;
}

export const purchaseYieldToken = async(
    amount: number,
    recipient_address: string
) => {
  const result = await queryUsdcBalance(recipient_address);
  if (Number(result.totalBalance) < amount) {
    throw new Error("USDC is not enough");
  }
  const tx = new Transaction();
  const usdc_coins = await queryAllCoin(recipient_address, CoinType.USDC.TESTNET);
  // 初始化为第一个Coin，然后逐步merge剩余的
  usdc_coins.forEach((item) => {
    if (item.coinObjectId !== usdc_coins[0].coinObjectId) {
      tx.mergeCoins(tx.object(usdc_coins[0].coinObjectId), [
        tx.object(item.coinObjectId),
      ]);
    }
  });
  const [usdc] = tx.splitCoins(tx.object(usdc_coins[0].coinObjectId), [tx.pure.u64(amount)]);
  tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: YieldTokenModule.MODULE_NAME,
      function: YieldTokenModule.FUNCTIONS.PURCHASE_YIELD_TOKEN,
      typeArguments: [
        CoinType.YIELD_TOKEN.PALM, 
        CoinType.USDC.TESTNET
      ],
      arguments: [
          tx.object(networkConfig.testnet.YieldTokenInfo),
          usdc,
          tx.pure.address(recipient_address)
      ],
  });
  return tx;
    
}


