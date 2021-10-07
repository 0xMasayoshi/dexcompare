import React, { useMemo, useState } from 'react'
import { MetricsTable } from '.'
import { MetricsSection } from '..'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { inflationRate } from '../../../functions/metrics'

const Project: React.FC = () => {
  const { tokenData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const threeMonthInflations = dexes.map(
      (dex) =>
        inflationRate(
          tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.totalSupply,
          tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex + 13]?.totalSupply,
          tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex + 13]?.circulatingSupply
        ) * 100
    )

    return tokenData
      ? [
          { label: 'Token', format: 'string', values: dexes.map((dex) => dex.tokenSymbol) },
          {
            label: 'Circulating Supply',
            format: 'number',
            values: dexes.map((dex) => tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.circulatingSupply),
          },
          {
            label: 'Total Supply',
            format: 'number',
            values: dexes.map((dex) => tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.totalSupply),
          },
          {
            label: 'Fully Diluted Supply',
            format: 'number',
            values: dexes.map((dex) => tokenData?.[dex.coinGeckoId]?.fullyDilutedSupply),
          },
          {
            label: 'Supply Outstanding',
            format: 'percent',
            values: dexes.map(
              (dex) =>
                (tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.circulatingSupply /
                  tokenData?.[dex.coinGeckoId]?.fullyDilutedSupply) *
                100
            ),
          },
          {
            label: '3 Month Inflation',
            format: 'percent',
            values: threeMonthInflations,
          },
          {
            label: "Add'l Buy Power Needed",
            format: 'usd',
            values: dexes.map((dex, i) =>
              threeMonthInflations[i] > 0
                ? (threeMonthInflations[i] / 100) *
                  tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.circulatingSupply *
                  tokenData?.[dex.coinGeckoId]?.price
                : 0
            ),
          },
          { label: 'Token Holder Share', format: 'percent', values: dexes.map((dex) => dex.tokenHolderShare * 100) },
        ]
      : []
  }, [dataIndex, tokenData])

  return (
    <MetricsSection label="Project">
      <MetricsTable
        tableData={tableData}
        dates={tokenData?.[SushiSwap.coinGeckoId]?.weeklyData?.map((data) => data.date)}
        index={dataIndex}
        setIndex={setDataIndex}
      />
    </MetricsSection>
  )
}

export default Project
