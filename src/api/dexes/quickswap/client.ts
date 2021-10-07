import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const quickswapSubgraph = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})
