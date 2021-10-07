export type ChainNameMap = { [chainId: number]: string };

export type RpcMap = { [chainId: number]: string };

export type DEX = {
  name: string;
  tokenSymbol: string;
  coinGeckoId: string;
  chains: ChainId[];
  protocolFee: number;
  tokenHolderShare: number;
  fetcher?: () => any;
};

export type CoinDataMap = { [coinId: string]: any };

export type DexDataMap = { [dexName: string]: any };

export type ClientMap = {
  [chainId: number]: ApolloClient<NormalizedCacheObject>;
};
