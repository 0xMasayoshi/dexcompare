import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const balancerSubgraph = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})
