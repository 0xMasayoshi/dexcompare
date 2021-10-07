import React, { useMemo, useState } from 'react'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { MetricsTable } from '.'
import { MetricsSection } from '..'

const Forward: React.FC = () => {
  const { dexData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(
    () =>
      dexData
        ? [
            {
              label: 'Annualized Volume',
              format: 'usd',
              values: dexes.map(
                (dex) =>
                  dexData?.[dex.name]?.weeklyData
                    .slice(dataIndex, dataIndex + 4)
                    .reduce((accumulator, current) => (accumulator += current.volume), 0) * 12
              ),
            },
            {
              label: 'Annualized Revenue',
              format: 'usd',
              values: dexes.map(
                (dex) =>
                  dexData?.[dex.name]?.weeklyData
                    .slice(dataIndex, dataIndex + 4)
                    .reduce((accumulator, current) => (accumulator += current.revenue), 0) * 12
              ),
            },
            {
              label: 'Tokenholder Earnings',
              format: 'usd',
              values: dexes.map(
                (dex) =>
                  dexData?.[dex.name]?.weeklyData
                    .slice(dataIndex, dataIndex + 4)
                    .reduce((accumulator, current) => (accumulator += current.revenue), 0) *
                    12 *
                    dex?.tokenHolderShare ?? 0
              ),
            },
          ]
        : [],
    [dataIndex, dexData]
  )

  return (
    <MetricsSection label="Forward">
      <MetricsTable
        tableData={tableData}
        dates={dexData?.[SushiSwap.name]?.weeklyData?.map((data) => data.date)}
        index={dataIndex}
        setIndex={setDataIndex}
      />
    </MetricsSection>
  )
}

export default Forward
