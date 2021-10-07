import React, { useMemo, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Tab, Tabs, Typography } from '@material-ui/core'
import { MdExpandMore } from 'react-icons/md'
import { MetricsTable } from '.'
import { useDexCompare } from '../../../contexts/DexCompareContext'
import { dexes, SushiSwap } from '../../../constants/dexes'
import { marketShare, percentChange, spread } from '../../../functions/metrics'

const Topline: React.FC = () => {
  const { dexData } = useDexCompare()

  const [tab, setTab] = useState(0)
  const [dataIndex, setDataIndex] = useState(0)

  const duration = useMemo(() => (tab === 1 ? 4 : tab === 2 ? 13 : 1), [tab])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

  const tableData = useMemo(() => {
    const volumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + duration)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const prevVolumes = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + duration, dataIndex + duration * 2)
        .reduce((accumulator, current) => (accumulator += current.volume), 0)
    )
    const volumePercentChanges = dexes.map((dex, i) =>
      volumes[i] && prevVolumes[i] ? ((volumes[i] - prevVolumes[i]) / prevVolumes[i]) * 100 : 0
    )

    const revenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex, dataIndex + duration)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const prevRevenues = dexes.map((dex) =>
      dexData?.[dex.name]?.weeklyData
        .slice(dataIndex + duration, dataIndex + duration * 2)
        .reduce((accumulator, current) => (accumulator += current.revenue), 0)
    )
    const revenuePercentChanges = dexes.map((dex, i) =>
      revenues[i] && prevRevenues[i] ? percentChange(revenues[i], prevRevenues[i]) * 100 : 0
    )

    const spreads = revenues.map((revenue, i) => spread(volumes[i], revenue))
    const prevSpreads = prevRevenues.map((revenue, i) => spread(prevVolumes[i], revenue))
    const spreadPercentChanges = dexes.map((dex, i) =>
      spreads[i] && prevSpreads[i] ? percentChange(spreads[i], prevSpreads[i]) * 100 : 0
    )

    const marketRevenue = revenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)
    const prevMarketRevenue = prevRevenues.reduce((sum, dexRevenue) => (sum += dexRevenue), 0)

    const marketShares = revenues.map((revenue) => marketShare(revenue, marketRevenue) * 100)
    const prevMarketShares = prevRevenues.map((revenue) => marketShare(revenue, prevMarketRevenue) * 100)
    const marketSharePercentChanges = dexes.map((dex, i) =>
      marketShares[i] && prevRevenues[i] ? percentChange(marketShares[i], prevMarketShares[i]) * 100 : 0
    )

    return dexData
      ? [
          {
            label: 'Spot Volumes',
            format: 'usd',
            values: volumes,
          },
          {
            label: 'Prev Quarter',
            format: 'usd',
            values: prevVolumes,
          },
          {
            label: '% Change',
            format: 'percent',
            values: volumePercentChanges,
          },
          {
            label: 'Revenues',
            format: 'usd',
            values: revenues,
          },
          {
            label: 'Prev Quarter',
            format: 'usd',
            values: prevRevenues,
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
            values: spreads,
          },
          {
            label: 'Prev Quarter',
            format: 'percent',
            values: prevSpreads,
          },
          {
            label: '% Change',
            format: 'percentChange',
            values: spreadPercentChanges,
          },
        ]
      : []
  }, [dataIndex, dexData, duration])

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<MdExpandMore />} style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
        <Box width="100%">
          <Typography align="center" style={{ fontWeight: 'bold' }}>
            Topline
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" overflow="scroll">
          <Box width="100%">
            <Tabs value={tab} onChange={handleTabChange} centered>
              <Tab label="Weekly" />
              <Tab label="Monthly" />
              <Tab label="Quarterly" />
            </Tabs>
          </Box>

          <MetricsTable
            tableData={tableData}
            dates={dexData?.[SushiSwap.name]?.weeklyData?.map((data) => data.date)}
            index={dataIndex}
            setIndex={setDataIndex}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default Topline
