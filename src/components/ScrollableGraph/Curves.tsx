import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid";
import { scaleLinear, scaleOrdinal, scaleTime } from "@visx/scale";
import { timeFormat, timeParse } from "d3-time-format";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Brush } from "@visx/brush";
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from "@visx/brush/lib/BaseBrush";
import {
  useTooltip,
  TooltipWithBounds,
  defaultStyles as defaultTooltipStyles,
} from "@visx/tooltip";
import Curve from "./Curve";
import { Group } from "@visx/group";
import { LegendOrdinal } from "@visx/legend";
import { localPoint } from "@visx/event";
import { extent, bisector, descending } from "d3-array";
import { Line, Bar } from "@visx/shape";
import { PatternLines } from "@visx/pattern";
import React from "react";
import millify from "millify";
import { formatNumber, formatPercent } from "../../functions/format";

export const getX = (data) => new Date(data?.date);
export const getY = (data) => data?.value;

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const PATTERN_ID = "brush_pattern";

const accentColor = "#6c5efb";

const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: "currentColor",
};

const parseDate = timeParse("%Y-%m-%d");

const format = timeFormat("%b %d");

const formatDate = (date) => format(parseDate(date));

const axisColor = "currentColor";

const axisBottomTickLabelProps = {
  textAnchor: "middle" as "middle",
  fontFamily: "Arial",
  fontSize: 10,
  fill: axisColor,
};
const axisLeftTickLabelProps = {
  dx: "-0.25em",
  dy: "0.25em",
  fontFamily: "Arial",
  fontSize: 10,
  textAnchor: "end" as "end",
  fill: axisColor,
};

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";

const Curves = ({
  compact = false,
  width,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  data,
  title = undefined,
  labels = undefined,
  note = undefined,
  colors = [purple1, purple2, purple3],
}) => {
  const allData = data.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    []
  );
  const largestSet = useMemo(() => {
    const largestLength = Math.max(...data.map((set) => set.length));
    return data.find((set) => set.length === largestLength);
  }, [data]);

  const [domain, setDomain] = useState();
  const brushRef = useRef<BaseBrush | null>(null);

  const filteredData = useMemo(() => {
    if (!domain) return data;

    const { x0, x1, y0, y1 } = domain;

    const maxYAllData = Math.max(...allData.map((d) => getY(d)));

    const maxY = Math.max(
      ...data
        .map((d) =>
          d
            .filter((s) => {
              const x = getX(s).getTime();
              return x > x0 && x < x1;
            })
            .map((d) => getY(d))
        )
        .reduce((accumulator, current) => accumulator.concat(current), [])
    );

    const scaledY1 = (y1 / maxYAllData) * maxY;

    const stockCopy = data.map((d) =>
      d.filter((s) => {
        const x = getX(s).getTime();
        const y = getY(s);
        return x > x0 && x < x1 && y > y0 && y < scaledY1;
      })
    );
    return stockCopy;
  }, [allData, data, domain]);

  const onBrushChange = (domain) => setDomain(domain);

  const innerHeight = height - margin.top - margin.bottom;

  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;

  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;

  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // Max
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);

  // scales
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(
          filteredData.reduce(
            (previousValue, currentValue) => previousValue.concat(currentValue),
            []
          ),
          getX
        ),
      }),
    [xMax, filteredData]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [
          Math.min(
            ...filteredData
              .reduce(
                (previousValue, currentValue) =>
                  previousValue.concat(currentValue),
                []
              )
              .map((d) => getY(d))
          ),
          Math.max(
            ...filteredData
              .reduce(
                (previousValue, currentValue) =>
                  previousValue.concat(currentValue),
                []
              )
              .map((d) => getY(d))
          ),
        ],
        nice: true,
      }),
    [yMax, filteredData]
  );

  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  const brushXScale = useMemo(
    () =>
      scaleTime({
        range: [0, xBrushMax],
        domain: extent(allData, getX),
      }),
    [allData, xBrushMax]
  );

  const brushYScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [
          Math.min(...allData.map((d) => getY(d))),
          Math.max(...allData.map((d) => getY(d))),
        ],
        nice: true,
      }),
    [allData, yBrushMax]
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: {
        x: brushXScale(getX(largestSet[0])),
      },
      end: {
        x: brushXScale(getX(largestSet[Math.floor(largestSet.length / 2)])),
      },
    }),
    [brushXScale, largestSet]
  );

  const colorScale = scaleOrdinal({
    domain: labels,
    range: colors,
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip();

  const bisectDate = bisector(descending).left;

  const handleTooltip = useCallback(
    (event) => {
      const { x, y } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x - margin.left);
      x0.setHours(0, 0, 0, 0);

      const indexes = filteredData.map((data) => {
        return bisectDate(data.map(getX), x0);
      });

      showTooltip({
        tooltipData: labels.reduce(
          (map, label, i) => ({ ...map, [label]: filteredData[i][indexes[i]] }),
          {}
        ),
        tooltipLeft: x,
        tooltipTop: y,
      });
    },
    [xScale, margin.left, filteredData, showTooltip, labels, bisectDate]
  );

  const tooltipDate = useMemo(() => {
    const label = labels.find((label) => tooltipData?.[label]);
    return label ? getX(tooltipData?.[label]).toDateString() : "";
  }, [labels, tooltipData]);

  useEffect(() => {
    // set brush on new data
    if (data) {
      const updater: UpdateBrush = (prevBrush) => {
        const newExtent = brushRef.current!.getExtent(
          initialBrushPosition.start,
          initialBrushPosition.end
        );

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };

        return newState;
      };
      brushRef.current.updateBrush(updater);
    }
  }, [data]);

  if (width < 10) {
    return null;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {title && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            top: margin.top / 2 - 10,
          }}
        >
          <LegendOrdinal
            scale={scaleOrdinal({ domain: [title] })}
            direction="row"
            labelMargin="0 15px 0 0"
          />
        </div>
      )}

      {labels && (
        <div
          className="absolute flex justify-center w-full text-base"
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            top: margin.top / 2 - 10,
          }}
        >
          <LegendOrdinal
            scale={colorScale}
            direction="row"
            labelMargin="0 15px 0 0"
          />
        </div>
      )}

      {note && (
        <div
          className="absolute flex justify-end w-full text-sm"
          style={{
            top: margin.top / 2 + height,
            right: margin.right,
          }}
        >
          <LegendOrdinal
            scale={scaleOrdinal({ domain: [note] })}
            direction="row"
            labelMargin="0 4px 0 0"
          />
        </div>
      )}

      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        <GridRows
          top={margin.top}
          left={margin.left}
          scale={yScale}
          width={xMax}
          height={yMax}
          strokeDasharray="1,3"
          stroke="currentColor"
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          left={margin.left}
          scale={xScale}
          height={yMax}
          strokeDasharray="1,3"
          stroke="currentColor"
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <Group top={margin.top} left={margin.left}>
          {width > 8 &&
            filteredData.map((curve, i) => {
              const even = i % 2 === 0;
              let markerStart = even ? "url(#marker-cross)" : "url(#marker-x)";
              if (i === 1) markerStart = "url(#marker-line)";
              const markerEnd = even
                ? "url(#marker-arrow)"
                : "url(#marker-arrow-odd)";
              return (
                <Curve
                  key={`chart-${i}`}
                  hideBottomAxis
                  hideLeftAxis
                  data={curve}
                  width={width}
                  xScale={xScale}
                  yScale={yScale}
                  stroke={colors[i]}
                  strokeWidth={2}
                  strokeOpacity={1}
                  markerMid="url(#marker-circle)"
                  markerStart={markerStart}
                  markerEnd={markerEnd}
                />
              );
            })}
          <Bar
            width={width - margin.left}
            height={yMax}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={width > 520 ? 10 : 5}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={() => axisBottomTickLabelProps}
          />
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={millify as any}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={() => axisLeftTickLabelProps}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft - margin.left, y: 0 }}
                to={{ x: tooltipLeft - margin.left, y: yMax }}
                stroke={accentColor}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
            </g>
          )}
        </Group>

        <Group
          top={topChartHeight + topChartBottomMargin + margin.top}
          left={brushMargin.left}
        >
          {data.map((brushData, i) => {
            const even = i % 2 === 0;
            let markerStart = even ? "url(#marker-cross)" : "url(#marker-x)";
            if (i === 1) markerStart = "url(#marker-line)";
            const markerEnd = even
              ? "url(#marker-arrow)"
              : "url(#marker-arrow-odd)";
            return (
              <Curve
                stroke={colors[i]}
                strokeWidth={2}
                strokeOpacity={1}
                hideBottomAxis
                hideLeftAxis
                data={brushData}
                width={width}
                yMax={yBrushMax}
                xScale={brushXScale}
                yScale={brushYScale}
                key={i}
              />
            );
          })}
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={["diagonal"]}
          />
          <Brush
            xScale={brushXScale}
            yScale={brushYScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            innerRef={brushRef}
            handleSize={8}
            resizeTriggerAreas={["left", "right", "top", "bottom"]}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={onBrushChange}
            selectedBoxStyle={selectedBrushStyle}
          />
        </Group>
      </svg>

      {tooltipData && (
        <div style={{ width }}>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 14}
            left={tooltipLeft}
            style={{
              ...defaultTooltipStyles,
              padding: "0.5rem",
              border: "1px solid white",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontWeight: "bold", alignSelf: "center" }}>
                {tooltipDate}
              </div>
              {labels.map(
                (label, i) =>
                  getY(tooltipData[label]) > 0 && (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: colors[i],
                            marginRight: 5,
                          }}
                        />
                        {label}
                      </div>
                      <div style={{ marginLeft: 12 }}>
                        {tooltipData[label].format === "percent"
                          ? formatPercent(getY(tooltipData[label]))
                          : formatNumber(
                              getY(tooltipData[label]),
                              tooltipData[label].format === "usd"
                            )}
                        {tooltipData[label].format === "x" && "x"}
                      </div>
                    </div>
                  )
              )}
            </div>
          </TooltipWithBounds>
        </div>
      )}
    </div>
  );
};
export default Curves;
