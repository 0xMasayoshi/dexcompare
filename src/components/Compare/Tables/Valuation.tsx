import React, { useMemo, useState } from 'react'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { MetricsTable } from '.'
import { MetricsSection } from '..'
import { peRatio, psRatio } from '../../../functions/metrics'

const Valuation: React.FC = () => {
  const { dexData, tokenData } = useDexCompare()
  const [dataIndex, setDataIndex] = useState(0)

  const tableData = useMemo(() => {
    const annualizedRevenues = dexes.map(
      (dex) =>
        dexData?.[dex.name]?.weeklyData
          .slice(dataIndex, dataIndex + 4)
          .reduce((accumulator, current) => (accumulator += current.revenue), 0) * 12
    )

    return tokenData && dexData
      ? [
          {
            label: 'Forward P/S',
            format: 'x',
            values: dexes.map((dex, i) =>
              psRatio(tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.marketCap, annualizedRevenues[i])
            ),
          },
          {
            label: 'Fully Diluted P/S',
            format: 'x',
            values: dexes.map((dex, i) =>
              psRatio(
                tokenData?.[dex.coinGeckoId]?.fullyDilutedSupply *
                  tokenData?.[dex.coinGeckoId]?.weeklyData[dataIndex].price,
                annualizedRevenues[i]
              )
            ),
          },
          {
            label: 'Forward P/E',
            format: 'x',
            values: dexes.map((dex, i) =>
              peRatio(
                tokenData?.[dex.coinGeckoId]?.weeklyData?.[dataIndex]?.marketCap,
                annualizedRevenues[i] * dex.tokenHolderShare
              )
            ),
          },
          {
            label: 'Fully Diluted P/E',
            format: 'x',
            values: dexes.map((dex, i) =>
              peRatio(
                tokenData?.[dex.coinGeckoId]?.fullyDilutedSupply *
                  tokenData?.[dex.coinGeckoId]?.weeklyData[dataIndex].price,
                annualizedRevenues[i] * dex.tokenHolderShare
              )
            ),
          },
          {
            label: 'Forward Dividend Yield',
            format: 'percent',
            values: dexes.map(
              (dex, i) =>
                ((annualizedRevenues[i] * dex.tokenHolderShare) /
                  dexData?.[dex.name]?.tokensStaked /
                  tokenData?.[dex.coinGeckoId]?.price) *
                100
            ),
          },
        ]
      : []
  }, [tokenData, dexData, dataIndex])

  return (
    <MetricsSection label="Valuation">
      <MetricsTable
        tableData={tableData}
        dates={dexData?.[SushiSwap.name]?.weeklyData?.map((data) => data.date)}
        index={dataIndex}
        setIndex={setDataIndex}
      />
    </MetricsSection>
  )
}

export default Valuation
