export function deriveDexDataFromWeeklyData(data) {
  const tvl = data[0]?.tvl
  const sameWeekPrevMonthTvl = data[4]?.tvl
  const tvlChange = (tvl - sameWeekPrevMonthTvl) / sameWeekPrevMonthTvl

  const weeklyVolume = data[0]?.volume - data[1]?.volume
  const prevWeekVolume = data[1]?.volume - data[2]?.volume
  const weeklyVolumeChange = (weeklyVolume - prevWeekVolume) / prevWeekVolume

  const monthlyVolume = data[0]?.volume - data[4]?.volume
  const prevMonthVolume = data[4]?.volume - data[8]?.volume
  const monthlyVolumeChange = (monthlyVolume - prevMonthVolume) / prevMonthVolume

  const quarterlyVolume = data[0]?.volume - data[13]?.volume
  const prevQuarterVolume = data[13]?.volume - data[26]?.volume
  const quarterlyVolumeChange = (quarterlyVolume - prevQuarterVolume) / prevQuarterVolume

  const weeklyRevenue = data[0]?.revenue - data[1]?.revenue
  const prevWeekRevenue = data[1]?.revenue - data[2]?.revenue
  const weeklyRevenueChange = (weeklyRevenue - prevWeekRevenue) / prevWeekRevenue

  const monthlyRevenue = data[0]?.revenue - data[4]?.revenue
  const prevMonthRevenue = data[4]?.revenue - data[8]?.revenue
  const monthlyRevenueChange = (monthlyRevenue - prevMonthRevenue) / prevMonthRevenue

  const quarterlyRevenue = data[0]?.revenue - data[13]?.revenue
  const prevQuarterRevenue = data[13]?.revenue - data[26]?.revenue
  const quarterlyRevenueChange = (quarterlyRevenue - prevQuarterRevenue) / prevQuarterRevenue

  const weeklyData = data.slice(0, -1).map((current, i) => ({
    date: current.date,
    tvl: current.tvl,
    volume: current.volume - data[i + 1]?.volume,
    revenue: current.revenue - data[i + 1]?.revenue,
  }))

  return {
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
    weeklyData,
  }
}
