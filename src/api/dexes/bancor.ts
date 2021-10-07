//https://docs.bancor.network/rest-api/api-reference

import { day, getWeeksAgoTimestamp, now } from "../../apollo/time";

const apiUrl = "https://api-v2.bancor.network";

async function bancorDailyHistoryCall(endpoint, startDate, endDate) {
  // api limits to 366 results per call, so might have to call
  const query = await fetch(
    apiUrl +
      endpoint +
      "?start_date=" +
      startDate +
      "&end_date=" +
      endDate +
      "&interval=day"
  );
  const data = (await query.json()).data;

  if (data?.length === 366 && data[365].timestamp / 1000 + day < endDate) {
    const nextSet = await bancorDailyHistoryCall(
      endpoint,
      Math.floor(data[365].timestamp / 1000),
      endDate
    );
    return data.concat(nextSet);
  }

  return data;
}

export async function fetchBancorData() {
  const startDate = getWeeksAgoTimestamp(100);

  const dailyVolumeData = (
    await bancorDailyHistoryCall("/history/volume", startDate, now)
  ).reverse();
  const dailyFeesData = (
    await bancorDailyHistoryCall("/history/fees", startDate, now)
  ).reverse();
  const dailyTvlData = (
    await bancorDailyHistoryCall("/history/liquidity-depth", startDate, now)
  ).reverse();

  const weeklyData = [];
  for (let i = 0; i < dailyFeesData.length; i += 7) {
    weeklyData.push({
      date: new Date(
        new Date(dailyFeesData[i].timestamp).toUTCString().replace(/GMT.*/g, "")
      ).toDateString(),
      volume: dailyVolumeData
        .slice(i, i + 7)
        .reduce((sum, data) => (sum += Number(data.usd)), 0),
      revenue: dailyFeesData
        .slice(i, i + 7)
        .reduce((sum, data) => (sum += Number(data.usd)), 0),
      tvl: Number(dailyTvlData[i].usd),
    });
  }

  const tvl = weeklyData[0].tvl;
  const sameWeekPrevMonthTvl = weeklyData[4].tvl;
  const tvlChange = (tvl - sameWeekPrevMonthTvl) / sameWeekPrevMonthTvl;

  const weeklyVolume = weeklyData[0].volume;
  const prevWeekVolume = weeklyData[1].volume;
  const weeklyVolumeChange = (weeklyVolume - prevWeekVolume) / prevWeekVolume;

  const monthlyVolume = weeklyData
    .slice(0, 4)
    .reduce((sum, data) => (sum += data.volume), 0);
  const prevMonthVolume = weeklyData
    .slice(4, 8)
    .reduce((sum, data) => (sum += data.volume), 0);
  const monthlyVolumeChange =
    (monthlyVolume - prevMonthVolume) / prevMonthVolume;

  const quarterlyVolume = weeklyData
    .slice(0, 13)
    .reduce((sum, data) => (sum += data.volume), 0);
  const prevQuarterVolume = weeklyData
    .slice(13, 26)
    .reduce((sum, data) => (sum += data.volume), 0);
  const quarterlyVolumeChange =
    (quarterlyVolume - prevQuarterVolume) / prevQuarterVolume;

  const weeklyRevenue = weeklyData[0].revenue;
  const prevWeekRevenue = weeklyData[1].revenue;
  const weeklyRevenueChange =
    (weeklyRevenue - prevWeekRevenue) / prevWeekRevenue;

  const monthlyRevenue = weeklyData
    .slice(0, 4)
    .reduce((sum, data) => (sum += data.revenue), 0);
  const prevMonthRevenue = weeklyData
    .slice(4, 8)
    .reduce((sum, data) => (sum += data.revenue), 0);
  const monthlyRevenueChange =
    (monthlyRevenue - prevMonthRevenue) / prevMonthRevenue;

  const quarterlyRevenue = weeklyData
    .slice(0, 13)
    .reduce((sum, data) => (sum += data.revenue), 0);
  const prevQuarterRevenue = weeklyData
    .slice(14, 26)
    .reduce((sum, data) => (sum += data.revenue), 0);
  const quarterlyRevenueChange =
    (quarterlyRevenue - prevQuarterRevenue) / prevQuarterRevenue;

  return {
    weeklyData,
    tvl,
    sameWeekPrevMonthTvl,
    tvlChange,
    weeklyVolume,
    prevWeekVolume,
    weeklyVolumeChange,
    monthlyVolume,
    prevMonthVolume,
    monthlyVolumeChange,
    quarterlyVolume,
    prevQuarterVolume,
    quarterlyVolumeChange,
    weeklyRevenue,
    prevWeekRevenue,
    weeklyRevenueChange,
    monthlyRevenue,
    prevMonthRevenue,
    monthlyRevenueChange,
    quarterlyRevenue,
    prevQuarterRevenue,
    quarterlyRevenueChange,
  };
}
