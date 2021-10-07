import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@sushiswap/sdk'
import { ClientMap } from '../../../types'

export const curveMainnet = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/curvefi/curve',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

export const curveSubgraph: ClientMap = {
  [ChainId.MAINNET]: curveMainnet,
}
