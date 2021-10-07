import gql from "graphql-tag";

export const UniqueCallersQuery = gql`
  query uniqueCallersQuery(
    $network: EthereumNetwork!
    $from: ISO8601DateTime
    $till: ISO8601DateTime
    $address: String!
  ) {
    ethereum(network: $network) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: { is: $address }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
  }
`;

// TODO -- add more sushi chains
// combined to avoid rate limiting
export const CombinedUniqueCallersQuery = gql`
  query uniqueCallersQuery($from: ISO8601DateTime, $till: ISO8601DateTime) {
    bancor: ethereum(network: ethereum) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0x2f9ec37d6ccfff1cab21733bdadede11c823ccb0"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    balancer: ethereum(network: ethereum) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0xba12222222228d8ba445958a75a0704d566bf2c8"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    kyber: ethereum(network: ethereum) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0x1c87257f5e8609940bc751a07bb085bb7f8cdbe6"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    pancakeswap: ethereum(network: bsc) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    quickswap: ethereum(network: matic) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    uniswap0: ethereum(network: ethereum) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    uniswap1: ethereum(network: ethereum) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0xe592427a0aece92de3edee1f18e0157c05861564"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    sushiswap0: ethereum(network: ethereum) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
    sushiswap1: ethereum(network: matic) {
      smartContractCalls(
        options: { desc: "date.date" }
        date: { since: $from, till: $till }
        smartContractAddress: {
          is: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
        }
      ) {
        date: date {
          date: startOfInterval(unit: week, offset: 0)
        }
        callers: count(uniq: senders)
      }
    }
  }
`;
