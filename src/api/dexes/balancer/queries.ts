import gql from "graphql-tag";

export const BalancerQuery = gql`
  query balancer($block: Block_height) {
    balancers(first: 1, block: $block) {
      id
      totalSwapVolume
      totalLiquidity
      totalSwapFee
    }
  }
`;

// query blockFromTimestampQuery($timestamp: Int!) {
//   blocks(
//       first: 1,
//       orderBy: timestamp,
//       orderDirection: desc,
//       where: { timestamp_lte: $timestamp }
//   ) {
//       number
//   }
// }

export function balancerQueryFactory(blocks, key) {
  const queryBody = blocks.reduce(
    (query, block, i) =>
      (query += `${key + i}: balancers(first: 1, block: {number: ${block} }) {
        id
        totalSwapVolume
        totalLiquidity
        totalSwapFee
      }
    `),
    ""
  );

  // console.log('balancerQueryBody', queryBody)

  return gql`
    query balancer {
      ${queryBody}
    }`;
}
