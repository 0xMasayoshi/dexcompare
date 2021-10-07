import { ChainId } from '@sushiswap/sdk'
import { quickswapSubgraph } from './client'
import { quickswapQueryFactory } from './queries'
import { QuickSwap } from '../../../constants/dexes'
import { getWeekTimestamps } from '../../../apollo/time'
import { blocksSubgraph } from '../../../apollo/client'
import { blocksQueryFactory } from '../../blocks/queries'
import { deriveDexDataFromWeeklyData } from '..'
import { getTokenSupply } from '../../tokens/tokenSupply'

export async function fetchQuickswapData() {
  const timestamps = getWeekTimestamps(100)

  const weeklyBlocksQuery = await blocksSubgraph[ChainId.MATIC].query({
    query: blocksQueryFactory(timestamps, 'week'),
  })

  const blocks = Object.entries(weeklyBlocksQuery.data)
    .filter((entry: any) => entry[1].length)
    .map((element, i) => weeklyBlocksQuery.data['week' + i][0].number)

  const weeklyDataQuery = await quickswapSubgraph.query({
    query: quickswapQueryFactory(blocks, 'week'),
  })

  const weeklyData = Object.keys(blocks).map((element, i) => ({
    date: new Date(timestamps[i] * 1000).toDateString(),
    tvl: Number(weeklyDataQuery?.data?.['week' + i][0]?.totalLiquidityUSD ?? 0),
    volume: Number(weeklyDataQuery?.data?.['week' + i][0]?.totalVolumeUSD ?? 0),
    revenue: Number(weeklyDataQuery?.data?.['week' + i][0]?.totalVolumeUSD ?? 0) * QuickSwap.protocolFee,
  }))

  const tokensStaked = await getTokenSupply(ChainId.MATIC, '0xf28164a485b0b2c90639e47b0f377b4a438a16b1')

  return { ...deriveDexDataFromWeeklyData(weeklyData), tokensStaked: tokensStaked / 1e18 }
}
