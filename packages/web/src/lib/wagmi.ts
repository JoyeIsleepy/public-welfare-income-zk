import { type Chain } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// 定义Monadtest链
export const monadtest: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet-explorer.monad.xyz',
    },
  },
  testnet: true,
}


const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '56305ecce9d7b753c3e0eeb4de597c63'

// 使用最简化的配置，避免外部API问题
export const config = getDefaultConfig({
  appName: '公益溯源捐款',
  projectId,
  chains: [monadtest],
  ssr: false,
})