import gql from 'graphql-tag'

export const factoryQuery = gql`
  query factoryQuery($block: Block_height) {
    factories(first: 1, block: $block) {
      id
      volumeUSD
      liquidityUSD
      userCount
    }
  }
`

export const masterChefV2InfoQuery = gql`
  query masterChefV2Info($id: String!) {
    masterChef(id: $id) {
      id
      totalAllocPoint
    }
  }
`

export const masterChefV2RewarderQuery = gql`
  query masterChefV2Info($id: String!) {
    rewarder(id: $id) {
      id
      rewardToken
      rewardPerSecond
    }
  }
`

export const miniChefInfoQuery = gql`
  query miniChefInfo($id: String!) {
    miniChef(id: $id) {
      id
      totalAllocPoint
      sushiPerSecond
    }
  }
`

export const miniChefRewarderQuery = gql`
  query miniChefRewarderQuery($id: String!) {
    rewarder(id: $id) {
      id
      rewardToken
      rewardPerSecond
    }
  }
`

export const miniChefRewardersQuery = gql`
  query miniChefRewarderQuery($first: Int! = 5) {
    rewarders(first: $first) {
      id
      rewardToken
      rewardPerSecond
    }
  }
`

export const miniChefPoolsQueryByRewarder = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
    $rewarder: String!
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { rewarder: $rewarder }
    ) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
      allocPoint
      lastRewardTime
      accSushiPerShare
      slpBalance
      userCount
      miniChef {
        id
        sushiPerSecond
        totalAllocPoint
      }
    }
  }
`

export const miniChefPoolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
      allocPoint
      lastRewardTime
      accSushiPerShare
      slpBalance
      userCount
      miniChef {
        id
        sushiPerSecond
        totalAllocPoint
      }
    }
  }
`

export const miniChefPoolsTimeTravelQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $block: Block_height!
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, block: $block, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
      allocPoint
      lastRewardTime
      accSushiPerShare
      slpBalance
      userCount
      miniChef {
        id
        sushiPerSecond
        totalAllocPoint
      }
    }
  }
`

export const masterchefV2PoolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
      allocPoint
      lastRewardBlock
      accSushiPerShare
      slpBalance
      userCount
      masterChef {
        id
        totalAllocPoint
      }
    }
  }
`

export const masterchefV2PoolsTimeTravelQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $block: Block_height!
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, block: $block, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
      allocPoint
      lastRewardBlock
      accSushiPerShare
      slpBalance
      userCount
      masterChef {
        id
        totalAllocPoint
      }
    }
  }
`

export const liquidityPositionSubsetQuery = gql`
  query liquidityPositionSubsetQuery($first: Int! = 1000, $user: Bytes!) {
    liquidityPositions(first: $first, where: { user: $user }) {
      id
      liquidityTokenBalance
      user {
        id
      }
      pair {
        id
      }
    }
  }
`

export const tokenFieldsQuery = gql`
  fragment tokenFields on Token {
    id
    symbol
    name
    decimals
    totalSupply
    volume
    volumeUSD
    untrackedVolumeUSD
    txCount
    liquidity
    derivedETH
  }
`

export const tokenQuery = gql`
  query tokenQuery($id: String!) {
    token(id: $id) {
      ...tokenFields
    }
  }
  ${tokenFieldsQuery}
`

export const pairTokenFieldsQuery = gql`
  fragment pairTokenFields on Token {
    id
    name
    symbol
    totalSupply
    derivedETH
    decimals
  }
`

export const pairFieldsQuery = gql`
  fragment pairFields on Pair {
    id
    reserveUSD
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    trackedReserveETH
    token0 {
      ...pairTokenFields
    }
    token1 {
      ...pairTokenFields
    }
    reserve0
    reserve1
    token0Price
    token1Price
    totalSupply
    txCount
    timestamp
  }
  ${pairTokenFieldsQuery}
`

export const pairSubsetQuery = gql`
  query pairSubsetQuery(
    $first: Int! = 1000
    $pairAddresses: [Bytes]!
    $orderBy: String! = "trackedReserveETH"
    $orderDirection: String! = "desc"
  ) {
    pairs(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: { id_in: $pairAddresses }) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairsQuery = gql`
  query pairsQuery($first: Int! = 1000, $orderBy: String! = "trackedReserveETH", $orderDirection: String! = "desc") {
    pairs(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairTimeTravelQuery = gql`
  query pairTimeTravelQuery($id: String!, $block: Block_height!) {
    pair(id: $id, block: $block) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairSubsetTimeTravelQuery = gql`
  query pairsTimeTravelQuery($first: Int! = 1000, $pairAddresses: [Bytes]!, $block: Block_height!) {
    pairs(
      first: $first
      block: $block
      orderBy: trackedReserveETH
      orderDirection: desc
      where: { id_in: $pairAddresses }
    ) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairsTimeTravelQuery = gql`
  query pairsTimeTravelQuery($first: Int! = 1000, $block: Block_height!) {
    pairs(first: $first, block: $block, orderBy: trackedReserveETH, orderDirection: desc) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

const blockFieldsQuery = gql`
  fragment blockFields on Block {
    id
    number
    timestamp
  }
`

export const blockQuery = gql`
  query blockQuery($start: Int!, $end: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $start, timestamp_lt: $end }) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`

export const blocksQuery = gql`
  query blocksQuery($first: Int! = 1000, $skip: Int! = 0, $start: Int!, $end: Int!) {
    blocks(
      first: $first
      skip: $skip
      orderBy: number
      orderDirection: desc
      where: { timestamp_gt: $start, timestamp_lt: $end }
    ) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`

export const blockFromTimestampQuery = gql`
  query blockFromTimestampQuery($timestamp: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_lte: $timestamp }) {
      number
    }
  }
`

export const poolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      allocPoint
      lastRewardBlock
      accSushiPerShare
      balance
      userCount
      owner {
        id
        sushiPerBlock
        totalAllocPoint
      }
    }
  }
`

export const tokensQuery = gql`
  query tokensQuery($first: Int! = 1000) {
    tokens(first: $first, orderBy: volumeUSD, orderDirection: desc) {
      ...tokenFields
    }
  }
  ${tokenFieldsQuery}
`

export const bentoTokenFieldsQuery = gql`
  fragment bentoTokenFields on Token {
    id
    # bentoBox
    name
    symbol
    decimals
    totalSupplyElastic
    totalSupplyBase
    block
    timestamp
  }
`

export const lendingPairFields = gql`
  fragment lendingPairFields on KashiPair {
    id
    # bentoBox
    type
    masterContract
    owner
    feeTo
    name
    symbol
    oracle
    asset {
      ...bentoTokenFields
    }
    collateral {
      ...bentoTokenFields
    }
    exchangeRate
    totalAssetElastic
    totalAssetBase
    totalCollateralShare
    totalBorrowElastic
    totalBorrowBase
    interestPerSecond
    utilization
    feesEarnedFraction
    totalFeesEarnedFraction
    lastAccrued
    supplyAPR
    borrowAPR
    # transactions
    # users
    block
    timestamp
  }
  ${bentoTokenFieldsQuery}
`

export const lendingPairSubsetTimeTravelQuery = gql`
  query lendingPairSubsetTimeTravelQuery(
    $first: Int! = 1000
    $pairAddresses: [Bytes]!
    $orderBy: String! = "utilization"
    $orderDirection: String! = "desc"
    $block: Block_height!
  ) {
    kashiPairs(
      first: $first
      block: $block
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { id_in: $pairAddresses }
    ) {
      ...lendingPairFields
    }
  }
  ${lendingPairFields}
`

export const lendingPairSubsetQuery = gql`
  query lendingPairSubsetQuery(
    $first: Int! = 1000
    $pairAddresses: [Bytes]!
    $orderBy: String! = "utilization"
    $orderDirection: String! = "desc"
  ) {
    kashiPairs(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: { id_in: $pairAddresses }) {
      ...lendingPairFields
    }
  }
  ${lendingPairFields}
`

export const tokenPriceQuery = gql`
  query tokenPriceQuery($id: String!) {
    token(id: $id) {
      id
      derivedETH
    }
  }
`

export const bundleFields = gql`
  fragment bundleFields on Bundle {
    id
    ethPrice
  }
`

export const ethPriceQuery = gql`
  query ethPriceQuery($id: Int! = 1, $block: Block_height) {
    bundles(id: $id, block: $block) {
      ...bundleFields
    }
  }
  ${bundleFields}
`

export const ethPriceTimeTravelQuery = gql`
  query ethPriceTimeTravelQuery($id: Int! = 1, $block: Block_height!) {
    bundles(id: $id, block: $block) {
      ...bundleFields
    }
  }
  ${bundleFields}
`

export const userLiquidityPositionsQuery = gql`
  query userLiquidityPositionsQuery($id: String!) {
    user(id: $id) {
      liquidityPositions {
        id
        liquidityTokenBalance
        pair {
          id
          name
          totalSupply
          reserve0
          reserve1
          token0 {
            id
            name
            symbol
            decimals
          }
          token1 {
            id
            name
            symbol
            decimals
          }
        }
      }
    }
  }
`

export function sushiswapQueryFactory(blocks, key) {
  const queryBody = blocks.reduce(
    (query, block, i) =>
      (query += `${key + i}: factories(first: 1, block: {number: ${block} }) {
        id
        volumeUSD
        liquidityUSD
      }
    `),
    ''
  )

  return gql`
    query sushiswap {
      ${queryBody}
    }`
}
