import { ChainId } from '@sushiswap/sdk'
import { uniswapV2Subgraph, uniswapV3Subgraph } from './client'
import { uniswapV2QueryFactory, uniswapV3QueryFactory } from './queries'
import { UniSwap } from '../../../constants/dexes'
import { getWeekTimestamps } from '../../../apollo/time'
import { blocksQueryFactory } from '../../blocks/queries'
import { blocksSubgraph } from '../../../apollo/client'
import { deriveDexDataFromWeeklyData } from '..'

export async function fetchUniswapData() {
  const timestamps = getWeekTimestamps(100)

  const weeklyBlocksQuery = await blocksSubgraph[ChainId.MAINNET].query({
    query: blocksQueryFactory(timestamps, 'week'),
  })

  const blocks = Object.entries(weeklyBlocksQuery.data)
    .filter((entry: any) => entry[1].length)
    .map((element, i) => weeklyBlocksQuery.data['week' + i][0].number)

  const v2WeeklyDataQuery = await uniswapV2Subgraph.query({
    query: uniswapV2QueryFactory(blocks, 'week'),
  })

  const v2WeeklyData = Object.keys(blocks).map((element, i) => ({
    date: new Date(timestamps[i] * 1000).toDateString(),
    tvl: Number(v2WeeklyDataQuery.data['week' + i][0]?.totalLiquidityUSD ?? 0),
    volume: Number(v2WeeklyDataQuery.data['week' + i][0]?.totalVolumeUSD ?? 0),
    revenue: Number(v2WeeklyDataQuery.data['week' + i][0]?.totalVolumeUSD ?? 0) * UniSwap.protocolFee,
  }))

  const v3WeeklyDataQuery = await uniswapV3Subgraph.query({
    query: uniswapV3QueryFactory(blocks, 'week'),
  })

  const v3WeeklyData = Object.keys(blocks).map((element, i) => ({
    date: new Date(timestamps[i] * 1000).toDateString(),
    tvl: Number(v3WeeklyDataQuery.data['week' + i][0]?.totalValueLockedUSD ?? 0),
    volume: Number(v3WeeklyDataQuery.data['week' + i][0]?.totalVolumeUSD ?? 0),
    revenue: Number(v3WeeklyDataQuery.data['week' + i][0]?.totalFeesUSD ?? 0),
  }))

  const weeklyData = [v2WeeklyData, v3WeeklyData].reduce((accumulator, current, i) => {
    if (i === 0) {
      return current
    }
    return current.map((data, i) => ({
      date: data.date,
      tvl: data.tvl + accumulator[i].tvl,
      volume: data.volume + accumulator[i].volume,
      revenue: data.revenue + accumulator[i].revenue,
    }))
  }, [])

  return deriveDexDataFromWeeklyData(weeklyData)
}
