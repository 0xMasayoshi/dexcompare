import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { ChainId } from '@sushiswap/sdk'
import { ClientMap } from '../types'

function createClient(uri) {
  return new ApolloClient({
    link: createHttpLink({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })
}

export const minichefSubgraph: ClientMap = {
  [ChainId.MATIC]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/matic-minichef'),
  [ChainId.HARMONY]: createClient('https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-minichef'),
  [ChainId.XDAI]: createClient('https://api.thegraph.com/subgraphs/name/matthewlilley/xdai-minichef'),
  [ChainId.ARBITRUM]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-minichef'),
}

export const exchangeSubgraph: ClientMap = {
  [ChainId.ARBITRUM]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange'),
  [ChainId.AVALANCHE]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange'),
  [ChainId.BSC]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange'),
  [ChainId.CELO]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/celo-exchange'),
  [ChainId.FANTOM]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange'),
  [ChainId.HARMONY]: createClient('https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange'),
  [ChainId.HECO]: createClient('https://q.hg.network/subgraphs/name/heco-exchange/heco'),
  [ChainId.MAINNET]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/exchange'),
  [ChainId.MATIC]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange'),
  [ChainId.RINKEBY]: createClient('https://api.thegraph.com/subgraphs/name/bilalmir135/sushi-swap-exchange'),
  [ChainId.OKEX]: createClient('https://n19.hg.network/subgraphs/name/okex-exchange/oec'),
  [ChainId.XDAI]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/xdai-exchange'),
}

export const blocksSubgraph: ClientMap = {
  [ChainId.ARBITRUM]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-blocks'),
  [ChainId.AVALANCHE]: createClient('https://api.thegraph.com/subgraphs/name/matthewlilley/avalanche-blocks'),
  [ChainId.BSC]: createClient('https://api.thegraph.com/subgraphs/name/matthewlilley/bsc-blocks'),
  [ChainId.CELO]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/celo-blocks'),
  [ChainId.FANTOM]: createClient('https://api.thegraph.com/subgraphs/name/matthewlilley/fantom-blocks'),
  [ChainId.HARMONY]: createClient('https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-blocks'),
  [ChainId.HECO]: createClient('https://q.hg.network/subgraphs/name/hecoblocks/heco'),
  [ChainId.MAINNET]: createClient('https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'),
  [ChainId.MATIC]: createClient('https://api.thegraph.com/subgraphs/name/matthewlilley/polygon-blocks'),
  [ChainId.OKEX]: createClient('https://n19.hg.network/subgraphs/name/okexchain-blocks/oec'),
  [ChainId.XDAI]: createClient('https://api.thegraph.com/subgraphs/name/matthewlilley/xdai-blocks'),
}

export const bentoboxSubgraph: ClientMap = {
  [ChainId.ARBITRUM]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-bentobox'),
  [ChainId.BSC]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/bsc-bentobox'),
  [ChainId.FANTOM]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/fantom-bentobox'),
  [ChainId.MAINNET]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/bentobox'),
  [ChainId.MATIC]: createClient('https://api.thegraph.com/subgraphs/name/sushiswap/matic-bentobox'),
}

export const masterchefSubgraph = createClient('https://api.thegraph.com/subgraphs/name/sushiswap/master-chef')

export const masterchefV2Subgraph = createClient('https://api.thegraph.com/subgraphs/name/sushiswap/master-chefv2')
