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
import { dexes } from "../../../constants/dexes";
import { useDexCompare } from "../../../contexts/DexCompareContext";
import { MdExpandMore } from "react-icons/md";
import ScrollableGraph from "../../ScrollableGraph";
import { chartColors, chartParams } from ".";
import { peRatio, psRatio } from "../../../functions/metrics";

enum Metric {
  Tvl,
  Volume,
  Revenue,
  Users,
  MarketShare,
  PS,
  PE,
}

const Dex: React.FC<chartParams> = ({ renderToggle }) => {
  const { dexData, userData, tokenData } = useDexCompare();

  const [metric, setMetric] = useState(Metric.Tvl);
  const [displayedDexes, setDisplayedDexes] = useState(
    dexes.reduce((map, current) => ({ ...map, [current.name]: true }), {})
  );

  const annualizedRevenues = useMemo(
    () =>
      dexes.reduce((accumulator, dex) => {
        accumulator[dex.name] = dexData?.[dex.name]?.weeklyData.map(
          (data, i) =>
            dexData?.[dex.name]?.weeklyData
              ?.slice(i, i + 4)
              .reduce(
                (accumulator, current) => (accumulator += current.revenue),
                0
              ) * 12
        );
        return accumulator;
      }, {}),
    [dexData]
  );

  const totalRevenues = useMemo(() => {
    if (!dexData) return undefined;

    return dexes
      .map((dex) => dexData[dex.name].weeklyData)
      .reduce((accumulator, current, i) => {
        current.forEach((data, i) => {
          if (i >= accumulator.length) {
            accumulator.push({ date: data.date, value: Number(data.revenue) });
          } else {
            accumulator[i].value += data.revenue;
          }
        });
        return accumulator;
      }, []);
  }, [dexData]);

  const chartData = useMemo(() => {
    if (!dexData || !totalRevenues) return {};

    return {
      labels: Object.keys(displayedDexes).filter((dex) => displayedDexes[dex]),
      data: Object.keys(displayedDexes)
        .filter((dex) => displayedDexes[dex])
        .map((dexName) => {
          const dex = dexes.find((dex) => dex.name === dexName);

          if (metric === Metric.Users) {
            return (
              userData?.[dex.name]?.weeklyData.map((data) => ({
                date: data.date,
                value: data.users,
                format: "number",
              })) ?? []
            );
          }

          if (metric === Metric.PS || metric === Metric.PE) {
            return tokenData[dex.coinGeckoId].weeklyData
              .map((data, i) => ({
                date: data.date,
                value:
                  metric === Metric.PS
                    ? psRatio(data.marketCap, annualizedRevenues[dex.name][i])
                    : peRatio(
                        data.marketCap,
                        annualizedRevenues[dex.name][i] * dex.tokenHolderShare
                      ),
                format: "x",
              }))
              .map((data) =>
                data.value === Infinity || isNaN(data.value)
                  ? { ...data, value: 0 }
                  : data
              );
          }

          return dexData[dex.name].weeklyData
            .map((data, i) => ({
              date: data.date,
              value:
                metric === Metric.Revenue
                  ? data.revenue
                  : metric === Metric.Tvl
                  ? data.tvl
                  : metric === Metric.Volume
                  ? data.volume
                  : metric === Metric.MarketShare
                  ? Number(data.revenue / totalRevenues[i]?.value || 0) * 100
                  : 0,
              format: metric === Metric.MarketShare ? "percent" : "usd",
            }))
            .filter((data) => data.value > 0);
        }),
    };
  }, [
    annualizedRevenues,
    dexData,
    displayedDexes,
    metric,
    tokenData,
    totalRevenues,
    userData,
  ]);

  const onDexToggle = (dex) => {
    displayedDexes[dex] = !displayedDexes[dex];
    setDisplayedDexes({ ...displayedDexes });
  };

  const colorMap = useMemo(
    () =>
      dexes.reduce(
        (map, dex, i) => ({ ...map, [dex.name]: chartColors[i] }),
        {}
      ),
    []
  );

  return (
    <Box display="flex" style={{ width: "100%" }}>
      <Box display="flex" flexDirection="column" justifyContent="start">
        {renderToggle && renderToggle()}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<MdExpandMore />}>
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
                <Button
                  size="small"
                  onClick={() => setMetric(Metric.Users)}
                  disabled={metric === Metric.Users}
                >
                  Users
                </Button>
                <Button
                  size="small"
                  onClick={() => setMetric(Metric.MarketShare)}
                  disabled={metric === Metric.MarketShare}
                >
                  Market Share
                </Button>
                <Button
                  size="small"
                  onClick={() => setMetric(Metric.PS)}
                  disabled={metric === Metric.PS}
                >
                  P/S
                </Button>
                <Button
                  size="small"
                  onClick={() => setMetric(Metric.PE)}
                  disabled={metric === Metric.PE}
                >
                  P/E
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />}>
            DEXes
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {dexes.map((dex) => (
                <FormControlLabel
                  key={dex.name}
                  control={
                    <Checkbox
                      checked={displayedDexes[dex.name]}
                      onChange={() => onDexToggle(dex.name)}
                    />
                  }
                  label={dex.name}
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
            colors={Object.keys(displayedDexes)
              .filter((dex) => displayedDexes[dex])
              .map((dex) => colorMap[dex])}
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

export default Dex;
