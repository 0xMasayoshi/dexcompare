import { blocksSubgraph } from "../../apollo/client";
import {
  blockFromTimestampQuery,
  blockQuery,
  blocksQuery,
} from "../../apollo/queries";
import {
  getUnixTime,
  startOfHour,
  startOfMinute,
  startOfSecond,
  subDays,
  subHours,
} from "date-fns";
import { ChainId } from "@sushiswap/sdk";

export async function getOneDayBlock(
  chainId: ChainId = 1
): Promise<{ number: number }> {
  const date = startOfMinute(subDays(Date.now(), 1));
  const start = Math.floor(Number(date) / 1000);
  const end = Math.floor(Number(date) / 1000) + 600;

  const blocksData = await blocksSubgraph[chainId].query({
    query: blockQuery,
    variables: {
      start,
      end,
    },
    context: {
      clientName: "blocklytics",
    },
    fetchPolicy: "network-only",
  });

  return { number: Number(blocksData?.data?.blocks[0].number) };
}

export async function getBlockFromTimestamp(
  chainId: ChainId = 1,
  timestamp: any
): Promise<{ number: number }> {
  timestamp =
    String(timestamp).length > 10 ? Math.floor(timestamp / 1000) : timestamp;

  const blocksData = await blocksSubgraph[chainId].query({
    query: blockFromTimestampQuery,
    variables: { timestamp },
    context: {
      clientName: "blocklytics",
    },
    fetchPolicy: "network-only",
  });

  return { number: Number(blocksData?.data?.blocks[0]?.number ?? 0) };
}

export async function getAverageBlockTime(
  chainId: ChainId = 1
): Promise<{ timestamp: null; difference: number }> {
  const now = startOfHour(Date.now());
  const start = getUnixTime(subHours(now, 6));
  const end = getUnixTime(now);
  const query = await blocksSubgraph[chainId].query({
    query: blocksQuery,
    variables: {
      start,
      end,
    },
  });
  const blocks = query?.data.blocks;

  const averageBlockTime = blocks.reduce(
    (previousValue: any, currentValue: any, currentIndex: any) => {
      if (previousValue.timestamp) {
        const difference = previousValue.timestamp - currentValue.timestamp;
        previousValue.difference = previousValue.difference + difference;
      }
      previousValue.timestamp = currentValue.timestamp;
      if (currentIndex === blocks.length - 1) {
        return previousValue.difference / blocks.length;
      }
      return previousValue;
    },
    { timestamp: null, difference: 0 }
  );
  return averageBlockTime;
}
