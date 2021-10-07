import * as React from "react";
import { DexCompareContextProvider } from "../contexts/DexCompareContext";
import { CombinedChart } from "../components/Compare/Charts";
import { Box, Container } from "@material-ui/core/";
import {
  ForwardTable,
  MarketTable,
  ProjectTable,
  ToplineTable,
  TvlTable,
  UsersTable,
  ValuationTable,
} from "../components/Compare/Tables";

export default function Index() {
  return (
    <DexCompareContextProvider>
      <Box maxHeight="100vh" overflow="scroll">
        <Container>
          <CombinedChart />
          <MarketTable />
          <ProjectTable />
          <ToplineTable />
          <ForwardTable />
          <TvlTable />
          <ValuationTable />
          <UsersTable />
        </Container>
      </Box>
    </DexCompareContextProvider>
  );
}
