import { ChainId } from '@sushiswap/sdk'
import { pancakeswapSubgraph } from './client'
import { pancakeswapQueryFactory } from './queries'
import { PancakeSwap } from '../../../constants/dexes'
import { getWeekTimestamps } from '../../../apollo/time'
import { blocksSubgraph } from '../../../apollo/client'
import { blocksQueryFactory } from '../../blocks/queries'
import { deriveDexDataFromWeeklyData } from '..'

export async function fetchPancakeSwapData() {
  const timestamps = getWeekTimestamps(100)

  const weeklyBlocksQuery = await blocksSubgraph[ChainId.BSC].query({
    query: blocksQueryFactory(timestamps, 'week'),
  })

  const blocks = Object.entries(weeklyBlocksQuery.data)
    .filter((entry: any) => entry[1].length)
    .map((element, i) => weeklyBlocksQuery.data['week' + i][0].number)

  const weeklyDataQuery = await pancakeswapSubgraph.query({
    query: pancakeswapQueryFactory(blocks, 'week'),
  })

  const weeklyData = Object.keys(blocks).map((element, i) => ({
    date: new Date(timestamps[i] * 1000).toDateString(),
    tvl: Number(weeklyDataQuery.data['week' + i][0]?.totalLiquidityUSD ?? 0),
    volume: Number(weeklyDataQuery.data['week' + i][0]?.totalVolumeUSD ?? 0),
    revenue: Number(weeklyDataQuery.data['week' + i][0]?.totalVolumeUSD ?? 0) * PancakeSwap.protocolFee,
  }))

  return deriveDexDataFromWeeklyData(weeklyData)
}
