import gql from 'graphql-tag'

export const QuickswapFactoryQuery = gql`
  query factoryQuery($block: Block_height) {
    uniswapFactories(first: 1, block: $block) {
      id
      totalVolumeUSD
      totalLiquidityUSD
    }
  }
`

export function quickswapQueryFactory(blocks, key) {
  const queryBody = blocks.reduce(
    (query, block, i) =>
      (query += `${key + i}: uniswapFactories(first: 1, block: {number: ${block} }) {
        id
        totalVolumeUSD
        totalLiquidityUSD
      }
    `),
    ''
  )

  return gql`
    query quickswap {
      ${queryBody}
    }`
}
