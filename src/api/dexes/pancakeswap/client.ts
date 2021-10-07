import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const pancakeswapSubgraph = new ApolloClient({
  link: createHttpLink({
    uri: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})
