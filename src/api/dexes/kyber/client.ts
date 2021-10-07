import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const kyberSubgraph = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/dynamic-amm',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})
