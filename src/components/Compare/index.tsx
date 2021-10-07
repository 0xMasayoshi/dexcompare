import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@material-ui/core'
import React, { ReactNode } from 'react'
import { MdExpandMore } from 'react-icons/md'

export interface TabPanelProps {
  children?: ReactNode
  index: any
  value: any
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

export interface MetricsSectionProps {
  label: String
  children?: any
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ label, children }: MetricsSectionProps) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<MdExpandMore />} style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
        <Box width="100%">
          <Typography align="center" style={{ fontWeight: 'bold' }}>
            {label}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}
