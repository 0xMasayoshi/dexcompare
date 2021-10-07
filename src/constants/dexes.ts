import { ChainId } from '@sushiswap/sdk'
import { fetchBalancerData } from '../api/dexes/balancer'
import { fetchBancorData } from '../api/dexes/bancor'
import { fetchKyberData } from '../api/dexes/kyber'
import { fetchPancakeSwapData } from '../api/dexes/pancakeswap'
import { fetchQuickswapData } from '../api/dexes/quickswap'
import { fetchSushiswapData } from '../api/dexes/sushiswap'
import { fetchUniswapData } from '../api/dexes/uniswap'
import { fetch0xData } from '../api/dexes/zeroX'
import { DEX } from '../types'

export const SushiSwap = {
  name: 'SushiSwap',
  tokenSymbol: 'SUSHI',
  coinGeckoId: 'sushi',
  chains: [
    ChainId.MAINNET,
    ChainId.ARBITRUM,
    ChainId.AVALANCHE,
    ChainId.BSC,
    // ChainId.CELO, // blocks subgraph messed up
    ChainId.FANTOM,
    ChainId.HARMONY,
    ChainId.HECO,
    ChainId.MATIC,
    ChainId.OKEX,
    ChainId.XDAI,
  ],
  protocolFee: 0.003,
  tokenHolderShare: 0.0005 / 0.003,
  fetcher: fetchSushiswapData,
}

export const UniSwap = {
  name: 'UniSwap',
  tokenSymbol: 'UNI',
  coinGeckoId: 'uniswap',
  chains: [ChainId.MAINNET],
  protocolFee: 0.0025,
  tokenHolderShare: 0,
  fetcher: fetchUniswapData,
}

export const Curve = {
  name: 'Curve',
  tokenSymbol: 'CRV',
  coinGeckoId: 'curve-dao-token',
  chains: [ChainId.MAINNET, ChainId.MATIC],
  protocolFee: 0.004,
  tokenHolderShare: 0.002 / 0.004,
}

export const Balancer = {
  name: 'Balancer',
  tokenSymbol: 'BAL',
  coinGeckoId: 'balancer',
  chains: [ChainId.MAINNET],
  protocolFee: 0,
  tokenHolderShare: 0,
  fetcher: fetchBalancerData,
}

export const Kyber = {
  name: 'KyberDMM',
  tokenSymbol: 'KNC',
  coinGeckoId: 'kyber-network-crystal',
  chains: [ChainId.MAINNET],
  protocolFee: 0,
  tokenHolderShare: 0.75,
  fetcher: fetchKyberData,
}

export const ZeroX = {
  name: '0x',
  tokenSymbol: 'ZRX',
  coinGeckoId: '0x',
  chains: [ChainId.MAINNET],
  protocolFee: 0,
  tokenHolderShare: 1,
  fetcher: fetch0xData,
}

export const Bancor = {
  name: 'Bancor',
  tokenSymbol: 'BNT',
  coinGeckoId: 'bancor',
  chains: [ChainId.MAINNET],
  protocolFee: 0,
  tokenHolderShare: 1 / 2,
  fetcher: fetchBancorData,
}

export const PancakeSwap = {
  name: 'PancakeSwap',
  tokenSymbol: 'CAKE',
  coinGeckoId: 'pancakeswap-token',
  chains: [ChainId.BSC],
  protocolFee: 0.0025,
  tokenHolderShare: 0.0008 / 0.0025,
  fetcher: fetchPancakeSwapData,
}

export const QuickSwap = {
  name: 'QuickSwap',
  tokenSymbol: 'QUICK',
  coinGeckoId: 'quick',
  chains: [ChainId.MATIC],
  protocolFee: 0.003,
  tokenHolderShare: 0.0004 / 0.003,
  fetcher: fetchQuickswapData,
}

export const dexes: DEX[] = [
  SushiSwap,
  UniSwap,
  // Curve, // TODO
  Balancer,
  Kyber,
  ZeroX,
  Bancor,
  PancakeSwap,
  QuickSwap,
]
