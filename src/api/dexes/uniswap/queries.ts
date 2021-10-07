import gql from 'graphql-tag'

export const UniswapV2FactoryQuery = gql`
  query factoryQuery($block: Block_height) {
    uniswapFactories(first: 1, block: $block) {
      id
      totalVolumeUSD
      totalLiquidityUSD
    }
  }
`

export const UniswapV3FactoryQuery = gql`
  query factoryQuery($block: Block_height) {
    factories(first: 1, block: $block) {
      id
      totalVolumeUSD
      totalValueLockedUSD
      totalFeesUSD
    }
  }
`

export function uniswapV2QueryFactory(blocks, key) {
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
    query uniswapv2 {
      ${queryBody}
    }`
}

export function uniswapV3QueryFactory(blocks, key) {
  const queryBody = blocks.reduce(
    (query, block, i) =>
      (query += `${key + i}: factories(first: 1, block: {number: ${block} }) {
        id
        totalVolumeUSD
        totalValueLockedUSD
        totalFeesUSD
      }
    `),
    ''
  )

  return gql`
    query uniswapv3 {
      ${queryBody}
    }`
}
