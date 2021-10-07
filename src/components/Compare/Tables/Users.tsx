import React, { useMemo, useState } from 'react'
import { MetricsTable } from '.'
import { MetricsSection } from '..'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { averageReturnPerUser, percentChange, volumePerCustomer } from '../../../functions/metrics'

const Users: React.FC = () => {
  const { dexData, userData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const weeklyUsers = dexes.map((dex) => userData?.[dex.name]?.weeklyData?.[dataIndex]?.users)
    const prevWeeklyUsers = dexes.map((dex) => userData?.[dex.name]?.weeklyData?.[dataIndex + 1]?.users)
    const prevMonthWeeklyUsers = dexes.map((dex) => userData?.[dex.name]?.weeklyData?.[dataIndex + 4]?.users)
    const prevQuarterWeeklyUsers = dexes.map((dex) => userData?.[dex.name]?.weeklyData?.[dataIndex + 12]?.users)

    const prevWeekPercentChanges = dexes.map((dex, i) =>
      weeklyUsers[i] && prevWeeklyUsers[i] ? percentChange(weeklyUsers[i], prevWeeklyUsers[i]) * 100 : 0
    )
    const prevMonthPercentChanges = dexes.map((dex, i) =>
      weeklyUsers[i] && prevMonthWeeklyUsers[i] ? percentChange(weeklyUsers[i], prevMonthWeeklyUsers[i]) * 100 : 0
    )
    const prevQuarterPercentChanges = dexes.map((dex, i) =>
      weeklyUsers[i] && prevQuarterWeeklyUsers[i] ? percentChange(weeklyUsers[i], prevQuarterWeeklyUsers[i]) * 100 : 0
    )

    return userData
      ? [
          { label: 'Weekly Users', format: 'number', values: weeklyUsers },
          {
            label: 'Prev Week',
            format: 'number',
            values: prevWeeklyUsers,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: prevWeekPercentChanges,
          },
          {
            label: 'Same Week Prev Month',
            format: 'number',
            values: prevMonthWeeklyUsers,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: prevMonthPercentChanges,
          },
          {
            label: 'Same Week Prev Quarter',
            format: 'number',
            values: prevQuarterWeeklyUsers,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: prevQuarterPercentChanges,
          },
          {
            label: 'Volume Per Customer',
            format: 'usd',
            values: dexes.map((dex) =>
              volumePerCustomer(
                dexData?.[dex.name]?.weeklyData?.[dataIndex]?.volume,
                userData?.[dex.name]?.weeklyData?.[dataIndex]?.users
              )
            ),
          },
          {
            label: 'Average Return Per User',
            format: 'usd',
            values: dexes.map((dex) =>
              averageReturnPerUser(
                dexData?.[dex.name]?.weeklyData?.[dataIndex]?.revenue,
                userData?.[dex.name]?.weeklyData?.[dataIndex]?.users
              )
            ),
          },
        ]
      : []
  }, [dataIndex, dexData, userData])

  return (
    <MetricsSection label="Users">
      <MetricsTable
        tableData={tableData}
        dates={dexData?.[SushiSwap.name]?.weeklyData?.map((data) => data.date)}
        index={dataIndex}
        setIndex={setDataIndex}
      />
    </MetricsSection>
  )
}

export default Users
