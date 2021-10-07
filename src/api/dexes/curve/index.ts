const apiUrl = 'https://api.curve.fi/api'

export async function fetch0xData() {
  const weeklyNetworkDataQuery = await fetch(apiUrl + '/metrics/network?granularity=week&period=year')
  const weeklyNetworkData = (await weeklyNetworkDataQuery.json()).reverse()

  const weeklyVolume = weeklyNetworkData[0].tradeVolume
  const prevWeekVolume = weeklyNetworkData[1].tradeVolume
  const weeklyVolumeChange = (weeklyVolume - prevWeekVolume) / prevWeekVolume

  const monthlyVolume = weeklyNetworkData.slice(0, 3).reduce((sum, data) => (sum += data.tradeVolume), 0)
  const prevMonthVolume = weeklyNetworkData.slice(4, 8).reduce((sum, data) => (sum += data.tradeVolume), 0)
  const monthlyVolumeChange = (monthlyVolume - prevMonthVolume) / prevMonthVolume

  const quarterlyVolume = weeklyNetworkData.slice(0, 13).reduce((sum, data) => (sum += data.tradeVolume), 0)
  const prevQuarterVolume = weeklyNetworkData.slice(14, 26).reduce((sum, data) => (sum += data.tradeVolume), 0)
  const quarterlyVolumeChange = (quarterlyVolume - prevQuarterVolume) / prevQuarterVolume

  console.log('networkData', weeklyNetworkData)

  return {
    tvl: 0,
    weeklyVolume,
    prevWeekVolume,
    weeklyVolumeChange,
    monthlyVolume,
    prevMonthVolume,
    monthlyVolumeChange,
    quarterlyVolume,
    prevQuarterVolume,
    quarterlyVolumeChange,
    weeklyRevenue: 0,
    prevWeekRevenue: 0,
    weeklyRevenueChange: 0,
    monthlyRevenue: 0,
    prevMonthRevenue: 0,
    monthlyRevenueChange: 0,
    quarterlyRevenue: 0,
    prevQuarterRevenue: 0,
    quarterlyRevenueChange: 0,
  }
}
