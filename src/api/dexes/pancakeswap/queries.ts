import gql from 'graphql-tag'

export const PancakeSwapFactoryQuery = gql`
  query factoryQuery($block: Block_height) {
    pancakeFactories(first: 1, block: $block) {
      id
      totalVolumeUSD
      totalLiquidityUSD
    }
  }
`

export function pancakeswapQueryFactory(blocks, key) {
  const queryBody = blocks.reduce(
    (query, block, i) =>
      (query += `${key + i}: pancakeFactories(first: 1, block: {number: ${block} }) {
        id
        totalVolumeUSD
        totalLiquidityUSD
      }
    `),
    ''
  )

  return gql`
    query pancakeswap {
      ${queryBody}
    }`
}
