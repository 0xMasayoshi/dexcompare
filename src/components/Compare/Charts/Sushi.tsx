import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormGroup,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@material-ui/core";
import { SushiSwap } from "../../../constants/dexes";
import { useDexCompare } from "../../../contexts/DexCompareContext";
import { ChainId } from "@sushiswap/sdk";
import { ChainNames } from "../../../constants/chains";
import { MdExpandMore } from "react-icons/md";
import ScrollableGraph from "../../ScrollableGraph";
import { chartColors, chartParams } from ".";

enum Metric {
  Tvl,
  Volume,
  Revenue,
}

const Sushi: React.FC<chartParams> = ({ renderToggle }) => {
  const { dexData } = useDexCompare();
  const weeklyDataChainMap = dexData?.[SushiSwap.name]?.weeklyDataChainMap;

  const [metric, setMetric] = useState(Metric.Tvl);
  const [chains, setChains] = useState(
    SushiSwap.chains.reduce((map, current) => ({ ...map, [current]: true }), {})
  );

  const normalizedDataMap = useMemo(() => {
    if (!weeklyDataChainMap) return undefined;

    const firstBlank = weeklyDataChainMap[ChainId.MAINNET]
      .map((data) => data.tvl)
      .indexOf(0);

    const largestSet = weeklyDataChainMap[ChainId.MAINNET].slice(0, firstBlank);

    SushiSwap.chains.forEach((chain) => {
      const data = [];

      for (let i = 0; i < largestSet.length; i++) {
        data.push({
          date: largestSet[i].date,
          tvl: weeklyDataChainMap[chain][i]?.tvl ?? 0,
          volume: weeklyDataChainMap[chain][i]?.volume ?? 0,
          revenue: weeklyDataChainMap[chain][i]?.revenue ?? 0,
          x: largestSet[i].date,
        });
      }
      weeklyDataChainMap[chain] = data;
    });

    return weeklyDataChainMap;
  }, [weeklyDataChainMap]);

  const chartData = useMemo(() => {
    if (!normalizedDataMap) return {};
    return {
      labels: SushiSwap.chains
        .filter((chain) => chains[chain])
        .map((chain) => ChainNames[chain]),
      title:
        metric === Metric.Revenue
          ? "Revenue"
          : metric === Metric.Tvl
          ? "TVL"
          : "Volume",
      data: SushiSwap.chains
        .filter((chain) => chains[chain])
        .map((chain) =>
          normalizedDataMap[chain].map((data) => ({
            date: data.date,
            value:
              metric === Metric.Revenue
                ? data.revenue
                : metric === Metric.Tvl
                ? data.tvl
                : data.volume,
            format: "usd",
          }))
        ),
    };
  }, [normalizedDataMap, chains, metric]);

  const onChainToggle = (chain) => {
    chains[chain] = !chains[chain];
    setChains({ ...chains });
  };

  const colorMap = useMemo(
    () =>
      SushiSwap.chains.reduce(
        (map, chain, i) => ({ ...map, [ChainNames[chain]]: chartColors[i] }),
        {}
      ),
    []
  );

  return (
    <Box display="flex" style={{ width: "100%" }}>
      <Box display="flex" flexDirection="column" justifyContent="start">
        {renderToggle && renderToggle()}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<MdExpandMore />}
            style={{ maxWidth: "100%" }}
          >
            Metric
          </AccordionSummary>
          <AccordionDetails>
            <Box width="10vw">
              <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                <Button
                  size="small"
                  onClick={() => setMetric(Metric.Tvl)}
                  disabled={metric === Metric.Tvl}
                >
                  Tvl
                </Button>
                <Button
                  size="small"
                  onClick={() => setMetric(Metric.Volume)}
                  disabled={metric === Metric.Volume}
                >
                  Volume
                </Button>
                <Button
                  size="small"
                  onClick={() => setMetric(Metric.Revenue)}
                  disabled={metric === Metric.Revenue}
                >
                  Revenue
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />}>
            Chains
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {SushiSwap.chains.map((chain) => (
                <FormControlLabel
                  key={chain}
                  control={
                    <Checkbox
                      checked={chains[chain]}
                      onChange={() => onChainToggle(chain)}
                    />
                  }
                  label={ChainNames[chain]}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      </Box>

      {chartData?.data?.length ? (
        <div style={{ width: "100%", height: 500 }}>
          <ScrollableGraph
            labels={chartData.labels}
            // title={chartData.title}
            data={chartData.data}
            margin={{ top: 64, right: 32, bottom: 16, left: 64 }}
            colors={chartData.labels.map((chain) => colorMap[chain])}
          />
        </div>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100vw"
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Sushi;
