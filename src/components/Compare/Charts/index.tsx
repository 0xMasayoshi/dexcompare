import React, { useCallback, useState } from 'react'
import { MetricsSection } from '..'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import Dex from './Dex'
import Sushi from './Sushi'

enum Chart {
  Dex,
  Sushi,
}

export const chartColors = [
  '#555E7B',
  '#B7D968',
  '#970084',
  '#E04644',
  '#5ECCFF',
  '#F07241',
  '#FEC6E3',
  '#4ECDC4',
  '#010101',
  '#FFD3B5',
  '#007748',
  '#00357A',
]

export interface chartParams {
  renderToggle?: () => React.ReactNode
}

export const CombinedChart: React.FC = () => {
  const [chart, setChart] = useState(Chart.Dex)

  const onChartToggle = (event, newChart) => {
    setChart(newChart)
  }

  const toggle = useCallback(() => {
    return (
      <ToggleButtonGroup value={chart} exclusive onChange={onChartToggle}>
        <ToggleButton disabled={chart === Chart.Dex} value={Chart.Dex} style={{ flex: 1 }}>
          Dex
        </ToggleButton>
        <ToggleButton disabled={chart === Chart.Sushi} value={Chart.Sushi} style={{ flex: 1 }}>
          Sushi
        </ToggleButton>
      </ToggleButtonGroup>
    )
  }, [chart])

  return (
    <MetricsSection label={(chart === Chart.Sushi ? 'Sushi' : 'Dex') + ' Chart'}>
      {chart === Chart.Dex && <Dex renderToggle={toggle} />}
      {chart === Chart.Sushi && <Sushi renderToggle={toggle} />}
    </MetricsSection>
  )
}

export { default as SushiChart } from './Sushi'
export { default as DexChart } from './Dex'
