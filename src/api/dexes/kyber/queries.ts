import gql from 'graphql-tag'

export const KyberDmmFactoryQuery = gql`
  query dmmFactory($block: Block_height) {
    dmmFactories(first: 1, block: $block) {
      id
      totalVolumeUSD
      totalLiquidityUSD
      totalFeeUSD
    }
  }
`

export function kyberQueryFactory(blocks, key) {
  const queryBody = blocks.reduce(
    (query, block, i) =>
      (query += `${key + i}: dmmFactories(first: 1, block: {number: ${block} }) {
        id
        totalVolumeUSD
        totalLiquidityUSD
        totalFeeUSD
      }
    `),
    ''
  )

  return gql`
    query kyber {
      ${queryBody}
    }`
}
