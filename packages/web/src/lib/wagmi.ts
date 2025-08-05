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

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'm89f61yfqM-Yk2WMpMwq3liE8Hn2RdUr'

export const config = getDefaultConfig({
  appName: 'Resume ZK',
  projectId,
  chains: [monadtest],
  ssr: true,
})