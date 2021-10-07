import { useCallback, useEffect, useMemo, useState } from 'react'
import { dexes } from '../constants/dexes'
import { timestampUtcToDate } from '../functions/convert'
import { CoinDataMap } from '../types'

const coinGeckoApi = 'https://api.coingecko.com/api/v3'
const diaDataApi = 'https://api.diadata.org/v1'

export function useTokenData() {
  const [data, setData] = useState(undefined)
  const coinGeckoIds = useMemo(() => dexes.map((dex) => dex.coinGeckoId), [])

  const fetchData = useCallback(async () => {
    const coinGeckoQuery = await Promise.all(coinGeckoIds.map((coinId) => fetch(coinGeckoApi + '/coins/' + coinId)))
    const coinGeckoData = await Promise.all(coinGeckoQuery.map((response) => response.json()))

    // note: ohlc granularity is 4 days
    const ohlcQuery = await Promise.all(
      coinGeckoIds.map((coinId) => fetch(coinGeckoApi + '/coins/' + coinId + '/ohlc?vs_currency=usd&days=max'))
    )
    const ohlcData = await Promise.all(ohlcQuery.map((response) => response.json()))

    const marketHistoryQuery = await Promise.all(
      coinGeckoIds.map((coinId) => fetch(coinGeckoApi + '/coins/' + coinId + '/market_chart?vs_currency=usd&days=max'))
    )

    const marketHistoryData = await Promise.all(marketHistoryQuery.map((response) => response.json()))

    const supplyQuery = await Promise.all(
      dexes.map((dex) => fetch(diaDataApi + '/supplies/' + dex.tokenSymbol.toUpperCase()))
    )

    const supplyData = await Promise.all(supplyQuery.map((response) => response.json()))

    const dataMap =
      coinGeckoData && ohlcData
        ? coinGeckoIds.reduce<CoinDataMap>((map, coinId, i) => {
            const coin = coinGeckoData[i]
            const ohlcHistory = ohlcData[i].reverse()
            const priceHistory = marketHistoryData[i].prices.reverse()
            const marketCapHistory = marketHistoryData[i].market_caps.reverse()
            const supplyHistory = supplyData[i].reverse()

            const fullyDilutedSupply = coin.market_data.max_supply || Infinity

            const weeklyMarketData = priceHistory
              .map((price, i) => ({
                date: timestampUtcToDate(price[0]).toDateString(),
                price: price[1],
                marketCap: marketCapHistory[i][1],
                circulatingSupply: marketCapHistory[i][1] / price[1],
                totalSupply: supplyHistory[i]?.Supply ?? marketCapHistory[i][1] / price[1],
                highPrice: ohlcHistory[Math.floor(i / 4)]?.[2],
                lowPrice: ohlcHistory[Math.floor(i / 4)]?.[3],
                ohlc: ohlcHistory[Math.floor(i / 4)],
              }))
              .filter((element, i) => i % 7 === 0)

            map[coin.id] = {
              weeklyData: weeklyMarketData,
              price: coin.market_data.current_price.usd,
              marketCap: coin.market_data.market_cap.usd,
              fullyDilutedMarketCap: coin.market_data.current_price.usd * fullyDilutedSupply,
              totalSupply: coin.market_data.total_supply,
              circulatingSupply: coin.market_data.circulating_supply,
              fullyDilutedSupply: fullyDilutedSupply,
              supplyOutstanding: coin.market_data.circulating_supply / fullyDilutedSupply,
            }
            return map
          }, {})
        : undefined
    setData(dataMap)
  }, [coinGeckoIds])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return data
}
