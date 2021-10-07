import { createContext, useContext } from 'react'
import { useActiveUserData } from '../hooks/useActiveUserData'
import { useTokenData } from '../hooks/useTokenData'
import { useDexData } from '../hooks/useDexData'

export interface DexCompareContextProps {
  dexData: any
  tokenData: any
  userData: any
}

export const DexCompareContext = createContext<DexCompareContextProps>({
  dexData: undefined,
  tokenData: undefined,
  userData: undefined,
})

export interface DexCompareContextProviderProps {
  children: any
}

export const DexCompareContextProvider: React.FC<DexCompareContextProviderProps> = ({
  children,
}: DexCompareContextProviderProps) => {
  const tokenData = useTokenData()
  const dexData = useDexData()
  const userData = useActiveUserData()

  return <DexCompareContext.Provider value={{ tokenData, dexData, userData }}>{children}</DexCompareContext.Provider>
}

export const useDexCompare = () => {
  const { dexData, tokenData, userData } = useContext(DexCompareContext)
  return { dexData, tokenData, userData }
}
