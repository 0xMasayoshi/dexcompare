import { useCallback, useEffect, useState } from 'react'
import { dexes } from '../constants/dexes'
import { DexDataMap } from '../types'

export function useDexData() {
  const [data, setData] = useState(undefined)

  const fetchData = useCallback(async () => {
    const dexData = await Promise.all(dexes.map(async (dex) => dex.fetcher()))

    const dataMap = dexes.reduce<DexDataMap>((map, dex, i) => {
      map[dex.name] = dexData[i]
      return map
    }, {})

    setData(dataMap)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return data
}
