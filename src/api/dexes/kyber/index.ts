import { ChainId } from '@sushiswap/sdk'
import { kyberSubgraph } from './client'
import { kyberQueryFactory } from './queries'
import { getWeekTimestamps } from '../../../apollo/time'
import { blocksSubgraph } from '../../../apollo/client'
import { blocksQueryFactory } from '../../blocks/queries'
import { deriveDexDataFromWeeklyData } from '..'

export async function fetchKyberData() {
  const timestamps = getWeekTimestamps(100)

  const weeklyBlocksQuery = await blocksSubgraph[ChainId.MAINNET].query({
    query: blocksQueryFactory(timestamps, 'week'),
  })

  const blocks = Object.keys(weeklyBlocksQuery.data).map((element, i) => weeklyBlocksQuery.data['week' + i][0].number)

  const weeklyDataQuery = await kyberSubgraph.query({
    query: kyberQueryFactory(blocks, 'week'),
  })

  const weeklyData = Object.keys(weeklyBlocksQuery.data).map((element, i) => ({
    date: new Date(timestamps[i] * 1000).toDateString(),
    tvl: Number(weeklyDataQuery.data['week' + i][0]?.totalLiquidityUSD ?? 0),
    volume: Number(weeklyDataQuery.data['week' + i][0]?.totalVolumeUSD ?? 0),
    revenue: Number(weeklyDataQuery.data['week' + i][0]?.totalFeeUSD ?? 0),
  }))

  return deriveDexDataFromWeeklyData(weeklyData)
}
