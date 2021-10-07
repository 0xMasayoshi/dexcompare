import React, { useMemo } from "react";
import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { dexes } from "../../../constants/dexes";
import { formatNumber, formatPercent } from "../../../functions/format";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";
import { average, median } from "../../../functions/array";

export interface MetricsTableProps {
  tableData: any[];
  dates?: string[];
  index?: number;
  setIndex?: (Number) => void;
}

export const MetricsTable: React.FC<MetricsTableProps> = ({
  tableData,
  dates,
  index,
  setIndex,
}: MetricsTableProps) => {
  const table = useMemo(
    () =>
      tableData.map((tableRow) => {
        if (tableRow.values) {
          if (tableRow.format === "string") {
            return {
              ...tableRow,
              values: [...tableRow.values, "-", "-"],
            };
          } else {
            const avg = average(
              tableRow?.values.map((value) =>
                !value || isNaN(value) || value === Infinity ? 0 : value
              )
            );
            const med = median(
              tableRow?.values.map((value) =>
                !value || isNaN(value) || value === Infinity ? 0 : value
              )
            );
            return {
              ...tableRow,
              values: [...tableRow.values, avg, med],
            };
          }
        }
        return tableRow;
      }),
    [tableData]
  );

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "white",
                padding: 0,
              }}
            >
              {dates !== undefined && index !== undefined ? (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="0"
                >
                  <RiArrowDropLeftFill
                    onClick={() => {
                      setIndex(index + 1);
                    }}
                    style={{ cursor: "pointer" }}
                    size="25"
                  />
                  <Select
                    value={index}
                    onChange={(event) => setIndex(Number(event.target.value))}
                  >
                    {dates.map((date, i) => {
                      return (
                        <MenuItem value={i} key={date}>
                          {date}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <RiArrowDropRightFill
                    onClick={() => {
                      if (index > 0) setIndex(index - 1);
                    }}
                    style={{ cursor: "pointer" }}
                    size="25"
                  />
                </Box>
              ) : (
                <></>
              )}
            </TableCell>
            {dexes.map((dex) => (
              <TableCell
                key={dex.name}
                style={{ fontWeight: "bold", border: 0 }}
              >
                {dex.name}
              </TableCell>
            ))}
            <TableCell style={{ fontWeight: "bold", border: 0 }}>
              Average
            </TableCell>
            <TableCell style={{ fontWeight: "bold", border: 0 }}>
              Median
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {table.map((tableRow, i) => (
            <TableRow
              key={i}
              style={{
                background: i % 2 === 0 ? "rgb(224, 224, 224)" : "white",
              }}
            >
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                  position: "sticky",
                  left: 0,
                  background: i % 2 === 0 ? "rgb(224, 224, 224)" : "white",
                  border: 0,
                }}
              >
                {tableRow.label}
              </TableCell>
              {tableRow.values.map((value, i) => (
                <TableCell
                  key={i + "-" + value}
                  style={
                    tableRow.format === "percentChange"
                      ? value > 0
                        ? { border: 0, color: "green" }
                        : { border: 0, color: "red" }
                      : { border: 0 }
                  }
                >
                  {value === Infinity
                    ? "-"
                    : tableRow.format === "number"
                    ? formatNumber(value)
                    : tableRow.format === "usd"
                    ? formatNumber(value, true)
                    : tableRow.format === "percent" ||
                      tableRow.format === "percentChange"
                    ? formatPercent(value)
                    : tableRow.format === "string"
                    ? value
                    : tableRow.format === "x"
                    ? formatNumber(value) + "x"
                    : undefined}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { default as ForwardTable } from "./Forward";
export { default as MarketTable } from "./Market";
export { default as ProjectTable } from "./Project";
export { default as ToplineTable } from "./Topline";
export { default as TvlTable } from "./Tvl";
export { default as UsersTable } from "./Users";
export { default as ValuationTable } from "./Valuation";
