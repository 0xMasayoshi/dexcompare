import React, { useMemo, useState } from 'react'
import { MetricsTable } from '.'
import { MetricsSection } from '..'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { marketCap, percentChange } from '../../../functions/metrics'

const Market: React.FC = () => {
  const { tokenData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const sixMonthHighs = dexes.map((dex) => {
      const sixMonthData = tokenData?.[dex.coinGeckoId]?.weeklyData
        ?.slice(dataIndex, dataIndex + 26)
        ?.map((data) => data.highPrice)
      return !sixMonthData?.length ? 0 : Math.max(...sixMonthData)
    })

    const sixMonthLows = dexes.map((dex) => {
      const sixMonthData = tokenData?.[dex.coinGeckoId]?.weeklyData
        ?.slice(dataIndex, dataIndex + 26)
        ?.map((data) => data.lowPrice)
      return !sixMonthData?.length ? 0 : Math.min(...sixMonthData)
    })

    return tokenData
      ? [
          { label: 'Token', format: 'string', values: dexes.map((dex) => dex.tokenSymbol) },
          {
            label: 'Price',
            format: 'usd',
            values: dexes.map((dex) => tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.price),
          },
          {
            label: '6 Month High',
            format: 'usd',
            values: sixMonthHighs,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: dexes.map(
              (dex, i) =>
                percentChange(tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.price, sixMonthHighs[i]) * 100
            ),
          },
          {
            label: '6 Month Low',
            format: 'usd',
            values: sixMonthLows,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: dexes.map(
              (dex, i) =>
                percentChange(tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.price, sixMonthLows[i]) * 100
            ),
          },
          {
            label: 'Market Cap',
            format: 'usd',
            values: dexes.map((dex) => tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.marketCap),
          },
          {
            label: 'Fully Diluted MC',
            format: 'usd',
            values: dexes.map((dex) =>
              marketCap(
                tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.price,
                tokenData?.[dex.coinGeckoId]?.fullyDilutedSupply
              )
            ),
          },
        ]
      : []
  }, [tokenData, dataIndex])

  return (
    <MetricsSection label="Market">
      <MetricsTable
        tableData={tableData}
        dates={tokenData?.[SushiSwap.coinGeckoId]?.weeklyData?.map((data) => data.date)}
        index={dataIndex}
        setIndex={setDataIndex}
      />
    </MetricsSection>
  )
}

export default Market
