import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      packageID:
        "0x0120095d66e8ee35f47cdf5d92133af491eb927d3953d06828f59e9dc7156498",
      StakePool:
        "0xea4c478327a73251d3f33e498704b945c210fa80e23e33c49c48058231dea46d",
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID:
        "0x6c6522852b4a8a36497eec262a0ee46872fcf69718f15e4a99050794d7ff7117",
        StakePool:
        "0xea4c478327a73251d3f33e498704b945c210fa80e23e33c49c48058231dea46d",
        AdminCap:
        "0x021fe66ad7525d641f3c479328ddd65ad8fcfa8336a92a22adbf3a0cd408215a",
        YieldTokenInfo:
        "0x598c420649c681243309ee2346629e4b0660cebded05e1a100aee643f4509eb9"
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-devnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient };
