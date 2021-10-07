import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

export const bitquery = new ApolloClient({
  link: createHttpLink({
    uri: "https://graphql.bitquery.io",
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});
