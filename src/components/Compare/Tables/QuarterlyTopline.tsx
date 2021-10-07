import React, { useMemo, useState } from 'react'
import { MetricsTable } from '.'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { marketShare, spread } from '../../../functions/metrics'

const QuarterlyTopline: React.FC = () => {
  const { dexData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const quarterlyVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + 13)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const prevQuarterlyVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + 13, dataIndex + 26)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const volumePercentChanges = dexes.map((dex, i) =>
      quarterlyVolumes[i] && prevQuarterlyVolumes[i]
        ? ((quarterlyVolumes[i] - prevQuarterlyVolumes[i]) / prevQuarterlyVolumes[i]) * 100
        : 0
    )

    const quarterlyRevenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + 13)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const prevQuarterlyRevenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + 13, dataIndex + 26)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const revenuePercentChanges = dexes.map((dex, i) =>
      quarterlyRevenues[i] && prevQuarterlyRevenues[i]
        ? ((quarterlyRevenues[i] - prevQuarterlyRevenues[i]) / prevQuarterlyRevenues[i]) * 100
        : 0
    )

    const quarterlySpreads = quarterlyRevenues.map((revenue, i) => spread(quarterlyVolumes[i], revenue))
    const prevQuarterlySpreads = prevQuarterlyRevenues.map((revenue, i) => spread(prevQuarterlyVolumes[i], revenue))
    const spreadPercentChanges = dexes.map((dex, i) =>
      quarterlySpreads[i] && prevQuarterlySpreads[i]
        ? ((quarterlySpreads[i] - prevQuarterlySpreads[i]) / prevQuarterlySpreads[i]) * 100
        : 0
    )

    const marketQuarterlyRevenue = quarterlyRevenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)
    const marketPrevQuarterRevenue = prevQuarterlyRevenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)

    const marketShares = quarterlyRevenues.map((revenue) => marketShare(revenue, marketQuarterlyRevenue) * 100)
    const prevMarketShares = prevQuarterlyRevenues.map(
      (revenue) => marketShare(revenue, marketPrevQuarterRevenue) * 100
    )
    const marketSharePercentChanges = dexes.map((dex, i) =>
      marketShares[i] && prevQuarterlyRevenues[i]
        ? ((marketShares[i] - prevMarketShares[i]) / prevMarketShares[i]) * 100
        : 0
    )

    return dexData
      ? [
          {
            label: 'Spot Volumes',
            format: 'usd',
            values: quarterlyVolumes,
          },
          {
            label: 'Prev Quarter',
            format: 'usd',
            values: prevQuarterlyRevenues,
          },
          {
            label: '% Change',
            format: 'percent',
            values: volumePercentChanges,
          },
          {
            label: 'Revenues',
            format: 'usd',
            values: quarterlyRevenues,
          },
          {
            label: 'Prev Quarter',
            format: 'usd',
            values: prevQuarterlyRevenues,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: revenuePercentChanges,
          },
          {
            label: 'Market Share',
            format: 'percent',
            values: marketShares,
          },
          {
            label: 'Prev Quarter',
            format: 'percent',
            values: prevMarketShares,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: marketSharePercentChanges,
          },
          {
            label: 'Spread',
            format: 'percent',
            values: quarterlySpreads,
          },
          {
            label: 'Prev Quarter',
            format: 'percent',
            values: prevQuarterlySpreads,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: spreadPercentChanges,
          },
        ]
      : []
  }, [dataIndex, dexData])

  return (
    <MetricsTable
      tableData={tableData}
      dates={dexData?.[SushiSwap.name]?.weeklyData?.map((data) => data.date)}
      index={dataIndex}
      setIndex={setDataIndex}
    />
  )
}

export default QuarterlyTopline
