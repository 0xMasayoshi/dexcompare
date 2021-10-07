import { useCallback, useEffect, useState } from 'react'
import { getAllUserData } from '../api/dexes/users'
import { dexes } from '../constants/dexes'
import { DexDataMap } from '../types'

export function useActiveUserData() {
  const [data, setData] = useState(undefined)

  const fetchData = useCallback(async () => {
    const userData: any = await getAllUserData()

    const userDataMap: DexDataMap = {}
    userDataMap['SushiSwap'] = userData.sushiswap
    userDataMap['UniSwap'] = userData.uniswap
    userDataMap['Balancer'] = userData.balancer
    userDataMap['KyberDMM'] = userData.kyber
    userDataMap['0x'] = userData.zeroX
    userDataMap['Bancor'] = userData.bancor
    userDataMap['QuickSwap'] = userData.quickswap
    userDataMap['PancakeSwap'] = userData.pancakeswap

    dexes.forEach((dex) => {
      const data = userDataMap[dex.name]
      userDataMap[dex.name] = {
        weeklyData: data,
      }
    })

    setData(userDataMap)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return data
}
