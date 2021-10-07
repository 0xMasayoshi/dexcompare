import React, { useMemo, useState } from 'react'
import { MetricsTable } from '.'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { marketShare, spread } from '../../../functions/metrics'

const WeeklyTopline: React.FC = () => {
  const { dexData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const weeklyVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + 1)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const prevWeeklyVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + 1, dataIndex + 2)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const volumePercentChanges = dexes.map((dex, i) =>
      weeklyVolumes[i] && prevWeeklyVolumes[i]
        ? ((weeklyVolumes[i] - prevWeeklyVolumes[i]) / prevWeeklyVolumes[i]) * 100
        : 0
    )

    const weeklyRevenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + 4)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const prevWeeklyRevenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + 1, dataIndex + 2)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const revenuePercentChanges = dexes.map((dex, i) =>
      weeklyRevenues[i] && prevWeeklyRevenues[i]
        ? ((weeklyRevenues[i] - prevWeeklyRevenues[i]) / prevWeeklyRevenues[i]) * 100
        : 0
    )

    const weeklySpreads = weeklyRevenues.map((revenue, i) => spread(weeklyVolumes[i], revenue))
    const prevWeeklySpreads = prevWeeklyRevenues.map((revenue, i) => spread(prevWeeklyVolumes[i], revenue))
    const spreadPercentChanges = dexes.map((dex, i) =>
      weeklySpreads[i] && prevWeeklySpreads[i]
        ? ((weeklySpreads[i] - prevWeeklySpreads[i]) / prevWeeklySpreads[i]) * 100
        : 0
    )

    const marketWeeklyRevenue = weeklyRevenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)
    const marketPrevWeekRevenue = prevWeeklyRevenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)

    const marketShares = weeklyRevenues.map((revenue) => marketShare(revenue, marketWeeklyRevenue) * 100)

    return dexData
      ? [
          { label: 'Volumes', format: 'usd', values: weeklyVolumes },
          { label: 'Prev Week', format: 'usd', values: prevWeeklyVolumes },
          {
            label: '% Change',
            format: 'percentChange',
            values: volumePercentChanges,
          },
          { label: 'Revenues', format: 'usd', values: weeklyRevenues },
          { label: 'Prev Week', format: 'usd', values: prevWeeklyRevenues },
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
          { label: 'Spread', format: 'percent', values: weeklySpreads },
          {
            label: 'Prev Week',
            format: 'percent',
            values: prevWeeklySpreads,
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

export default WeeklyTopline
