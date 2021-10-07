const apiUrl = 'https://api.0xtracker.com'

export async function fetch0xData() {
  const dailyNetworkNetworkQuery = await fetch(apiUrl + '/metrics/network?granularity=day&period=all')
  const dailyNetworkData = (await dailyNetworkNetworkQuery.json()).reverse()

  const weeklyData = []
  for (let i = 0; i < dailyNetworkData.length; i += 7) {
    weeklyData.push({
      date: new Date(dailyNetworkData[i].date.split('T')[0]).toDateString(),
      volume: dailyNetworkData.slice(i, i + 7).reduce((sum, data) => (sum += data.tradeVolume), 0),
      revenue: dailyNetworkData.slice(i, i + 7).reduce((sum, data) => (sum += data.protocolFees.USD), 0),
    })
  }

  const weeklyVolume = weeklyData[0].volume
  const prevWeekVolume = weeklyData[1].volume
  const weeklyVolumeChange = (weeklyVolume - prevWeekVolume) / prevWeekVolume

  const monthlyVolume = weeklyData.slice(0, 4).reduce((sum, data) => (sum += data.volume), 0)
  const prevMonthVolume = weeklyData.slice(4, 8).reduce((sum, data) => (sum += data.volume), 0)
  const monthlyVolumeChange = (monthlyVolume - prevMonthVolume) / prevMonthVolume

  const quarterlyVolume = weeklyData.slice(0, 13).reduce((sum, data) => (sum += data.volume), 0)
  const prevQuarterVolume = weeklyData.slice(13, 26).reduce((sum, data) => (sum += data.volume), 0)
  const quarterlyVolumeChange = (quarterlyVolume - prevQuarterVolume) / prevQuarterVolume

  const weeklyFees = weeklyData[0].revenue
  const prevWeekFees = weeklyData[1].revenue
  const weeklyFeesChange = (weeklyFees - prevWeekFees) / prevWeekFees

  const monthlyFees = weeklyData.slice(0, 4).reduce((sum, data) => (sum += Number(data.revenue)), 0)
  const prevMonthFees = weeklyData.slice(4, 8).reduce((sum, data) => (sum += Number(data.revenue)), 0)
  const monthlyFeesChange = (monthlyFees - prevMonthFees) / prevMonthFees

  const quarterlyFees = weeklyData.slice(0, 13).reduce((sum, data) => (sum += Number(data.revenue)), 0)
  const prevQuarterFees = weeklyData.slice(13, 26).reduce((sum, data) => (sum += Number(data.revenue)), 0)
  const quarterlyFeesChange = (quarterlyFees - prevQuarterFees) / prevQuarterFees

  return {
    weeklyData,
    tvl: 0,
    sameWeekPrevMonthTvl: 0,
    tvlChange: 0,
    weeklyVolume,
    prevWeekVolume,
    weeklyVolumeChange,
    monthlyVolume,
    prevMonthVolume,
    monthlyVolumeChange,
    quarterlyVolume,
    prevQuarterVolume,
    quarterlyVolumeChange,
    weeklyRevenue: weeklyFees,
    prevWeekRevenue: prevWeekVolume,
    weeklyRevenueChange: weeklyFeesChange,
    monthlyRevenue: monthlyFees,
    prevMonthRevenue: prevMonthFees,
    monthlyRevenueChange: monthlyFeesChange,
    quarterlyRevenue: quarterlyFees,
    prevQuarterRevenue: prevQuarterFees,
    quarterlyRevenueChange: quarterlyFeesChange,
  }
}
