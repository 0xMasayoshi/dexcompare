import React, { useMemo, useState } from 'react'
import { MetricsTable } from '.'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { marketShare, spread } from '../../../functions/metrics'

const MonthlyTopline: React.FC = () => {
  const { dexData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const monthlyVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + 4)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const prevMonthlyVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + 4, dataIndex + 8)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const volumePercentChanges = dexes.map((dex, i) =>
      monthlyVolumes[i] && prevMonthlyVolumes[i]
        ? ((monthlyVolumes[i] - prevMonthlyVolumes[i]) / prevMonthlyVolumes[i]) * 100
        : 0
    )

    const monthlyRevenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + 4)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const prevMonthlyRevenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + 4, dataIndex + 8)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const revenuePercentChanges = dexes.map((dex, i) =>
      monthlyRevenues[i] && prevMonthlyRevenues[i]
        ? ((monthlyRevenues[i] - prevMonthlyRevenues[i]) / prevMonthlyRevenues[i]) * 100
        : 0
    )

    const monthlySpreads = monthlyRevenues.map((revenue, i) => spread(monthlyVolumes[i], revenue))
    const prevMonthlySpreads = prevMonthlyRevenues.map((revenue, i) => spread(prevMonthlyVolumes[i], revenue))
    const spreadPercentChanges = dexes.map((dex, i) =>
      monthlySpreads[i] && prevMonthlySpreads[i]
        ? ((monthlySpreads[i] - prevMonthlySpreads[i]) / prevMonthlySpreads[i]) * 100
        : 0
    )

    const marketMonthlyRevenue = monthlyRevenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)
    const marketPrevMonthRevenue = prevMonthlyRevenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)

    const marketShares = monthlyRevenues.map((revenue) => marketShare(revenue, marketMonthlyRevenue) * 100)

    return dexData
      ? [
          { label: 'Volume', format: 'usd', values: monthlyVolumes },
          { label: 'Prev Month', format: 'usd', values: prevMonthlyVolumes },
          {
            label: '% Change',
            format: 'percentChange',
            values: volumePercentChanges,
          },
          { label: 'Revenue', format: 'usd', values: monthlyRevenues },
          { label: 'Prev Month', format: 'usd', values: prevMonthlyRevenues },
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
          { label: 'Spread', format: 'percent', values: monthlySpreads },
          {
            label: 'Prev Month',
            format: 'percent',
            values: prevMonthlySpreads,
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

export default MonthlyTopline
