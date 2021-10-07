import { ChainId } from '@sushiswap/sdk'
import { deriveDexDataFromWeeklyData } from '.'
import { blocksSubgraph, exchangeSubgraph } from '../../apollo/client'
import { sushiswapQueryFactory } from '../../apollo/queries'
import { getWeekTimestamps } from '../../apollo/time'
import { SushiSwap } from '../../constants/dexes'
import { blocksQueryFactory } from '../blocks/queries'
import { getTokenSupply } from '../tokens/tokenSupply'

export async function fetchSushiswapData() {
  const timestamps = getWeekTimestamps(100)

  const weeklyDataByChain = await Promise.all(
    SushiSwap.chains.map(async (chainId) => {
      const weeklyBlocksQuery = await blocksSubgraph[chainId].query({
        query: blocksQueryFactory(timestamps, 'week'),
      })

      const blocks = Object.entries(weeklyBlocksQuery.data)
        .filter((entry: any) => entry[1].length)
        .map((element, i) => weeklyBlocksQuery.data['week' + i][0].number)

      const weeklyDataQuery = await exchangeSubgraph[chainId].query({
        query: sushiswapQueryFactory(blocks, 'week'),
      })

      const weeklyData = weeklyDataQuery.data
        ? Object.keys(blocks).map((element, i) => ({
            date: new Date(timestamps[i] * 1000).toDateString(),
            tvl: Number(weeklyDataQuery.data['week' + i][0]?.liquidityUSD ?? 0),
            volume: Number(weeklyDataQuery.data['week' + i][0]?.volumeUSD ?? 0),
            revenue: Number(weeklyDataQuery.data['week' + i][0]?.volumeUSD ?? 0) * SushiSwap.protocolFee,
          }))
        : []

      return weeklyData
    })
  )

  const weeklyData = weeklyDataByChain.reduce((accumulator, current, i) => {
    current.forEach((data, i) => {
      if (accumulator.length === i) {
        accumulator.push({
          date: data.date,
          tvl: data.tvl,
          volume: data.volume,
          revenue: data.revenue,
        })
      } else {
        accumulator[i].tvl += data.tvl
        accumulator[i].volume += data.volume
        accumulator[i].revenue += data.revenue
      }
    })
    return accumulator
  }, [])

  const weeklyDataChainMap = SushiSwap.chains.reduce((map, chain, i) => {
    map[chain] = deriveDexDataFromWeeklyData(weeklyDataByChain[i]).weeklyData
    return map
  }, {})

  const tokensStaked = await getTokenSupply(ChainId.MAINNET, '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272')

  return { ...deriveDexDataFromWeeklyData(weeklyData), weeklyDataChainMap, tokensStaked: tokensStaked / 1e18 }
}
