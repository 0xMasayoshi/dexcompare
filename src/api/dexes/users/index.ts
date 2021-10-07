import { bitquery } from './client'
import { CombinedUniqueCallersQuery, UniqueCallersQuery } from './queries'

export async function fetchUserData(network, from, till, address) {
  const uniqueCallersQuery = await bitquery.query({
    query: UniqueCallersQuery,
    variables: {
      network,
      from,
      till,
      address,
    },
  })

  const UniqueCallers = uniqueCallersQuery?.data?.ethereum?.smartContractCalls
  return UniqueCallers
}

export async function fetchAllUserData() {
  const uniqueCallersQuery = await bitquery.query({
    query: CombinedUniqueCallersQuery,
  })

  // const uniqueCallersArray = Object.entries(uniqueCallersQuery.data).map(obj => {
  //     const [key, value]: [string, any] = obj;
  //     return [ key, value?.smartContractCalls ]
  // });

  // console.log('uniqueCallersQuery', uniqueCallersQuery.data)

  const uniqueCallers = Object.keys(uniqueCallersQuery.data).reduce(
    (attrs, key) => ({
      ...attrs,
      [key]: uniqueCallersQuery.data[key.toString()].smartContractCalls.map((data) => ({
        date: data.date.date,
        users: data.callers,
      })),
    }),
    {}
  )

  return uniqueCallers
}

export async function getAllUserData() {
  const userData: any = await fetchAllUserData()

  const sushiData = [userData.sushiswap0, userData.sushiswap1].reduce((accumulator, current) => {
    if (!accumulator.length) return current
    current.forEach((data, i) => (accumulator[i].users += data.users))
    return accumulator
  }, [])

  const uniData = [userData.uniswap0, userData.uniswap1].reduce((accumulator, current) => {
    if (!accumulator.length) return current
    current.forEach((data, i) => (accumulator[i].users += data.users))
    return accumulator
  }, [])

  const zeroXTradersQuery = await fetch('https://api.0xtracker.com/metrics/active-trader?granulatity=week&period=all')
  const zeroXUsers = (await zeroXTradersQuery.json())
    .reverse()
    .map((data) => ({ date: data.date.split('T')[0], users: data.traderCount }))

  return {
    ...userData,
    sushiswap: sushiData,
    uniswap: uniData,
    zeroX: zeroXUsers,
  }
}
