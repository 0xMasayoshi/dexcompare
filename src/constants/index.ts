import { ChainId } from "@sushiswap/sdk";
import { RpcMap } from "../types";

export const rpcUrl: RpcMap = {
  [ChainId.MAINNET]: "https://cloudflare-eth.com/",
  [ChainId.MATIC]: "https://rpc-mainnet.matic.quiknode.pro",
  [ChainId.XDAI]: "https://rpc.xdaichain.com",
  [ChainId.HARMONY]: "https://api.harmony.one/",
  [ChainId.ARBITRUM]: "https://arb1.arbitrum.io/rpc",
};
