import React, { useMemo, useState } from 'react'
import { MetricsTable } from '.'
import { MetricsSection } from '..'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { capitalEfficiency, marketCap, percentChange } from '../../../functions/metrics'

const Tvl: React.FC = () => {
  const { dexData, tokenData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const monthlyVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + 4)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    return tokenData && dexData
      ? [
          {
            label: 'TVL',
            format: 'usd',
            values: dexes.map((dex) => dexData?.[dex.name]?.weeklyData?.[dataIndex]?.tvl),
          },
          {
            label: 'Same Week Prev Month',
            format: 'usd',
            values: dexes.map((dex) => dexData?.[dex.name]?.weeklyData?.[dataIndex + 4]?.tvl),
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: dexes.map((dex) =>
              percentChange(
                dexData?.[dex.name]?.weeklyData?.[dataIndex]?.tvl,
                dexData?.[dex.name]?.weeklyData?.[dataIndex + 4]?.tvl
              )
            ),
          },
          {
            label: 'Market Cap / TVL',
            format: 'percent',
            values: dexes.map(
              (dex) =>
                (tokenData?.[dex.coinGeckoId]?.weeklyData[dataIndex].marketCap /
                  dexData?.[dex.name]?.weeklyData?.[dataIndex]?.tvl) *
                100
            ),
          },
          {
            label: 'Fully Diluted MC / TVL',
            format: 'percent',
            values: dexes.map(
              (dex) =>
                (marketCap(
                  tokenData?.[dex.coinGeckoId]?.weeklyData[dataIndex].totalSupply,
                  tokenData?.[dex.coinGeckoId]?.price
                ) /
                  dexData?.[dex.name]?.weeklyData?.[dataIndex]?.tvl) *
                100
            ),
          },
          {
            label: 'Capital Efficiency',
            format: 'number',
            values: dexes.map((dex, i) =>
              capitalEfficiency(monthlyVolumes[i], dexData?.[dex.name]?.weeklyData?.[dataIndex]?.tvl)
            ),
          },
        ]
      : []
  }, [tokenData, dexData, dataIndex])

  return (
    <MetricsSection label="Total Value Locked">
      <MetricsTable
        tableData={tableData}
        dates={tokenData?.[SushiSwap.coinGeckoId]?.weeklyData?.map((data) => data.date)}
        index={dataIndex}
        setIndex={setDataIndex}
      />
    </MetricsSection>
  )
}

export default Tvl
