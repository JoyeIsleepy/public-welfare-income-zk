'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { DonationFormTrigger } from './DonationForm'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const account = useAccount()

  const isConnected = mounted ? account.isConnected : false

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDonationSubmit = (data: any) => {
    // 表单组件内已经处理了智能合约调用，这里只是额外的日志记录
    // 在localstorage中保存数据
    const existingData = localStorage.getItem('monad-store')
    const dataArray = existingData ? JSON.parse(existingData) : []
    dataArray.push(data)
    localStorage.setItem('monad-store', JSON.stringify(dataArray))
  }

  return (
    <header className="top-0 left-0 right-0 z-50 bg-[#0e100f] border-b border-[#42433d]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <h1 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            公益溯源捐款
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {isConnected && (
            <div className="hidden lg:flex items-center text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Monad Testnet
            </div>
          )}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => { 
              const connected = mounted && account && chain
              console.log('=== RainbowKit Debug ===')
              console.log('mounted:', mounted, typeof mounted)
              console.log('account:', account, typeof account)
              console.log('chain:', chain, typeof chain)
              console.log('connected:', connected, typeof connected)
              console.log('openChainModal:', openChainModal, typeof openChainModal)
              return (
                <div
                  {...(!mounted && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-purple-500/30 text-sm md:text-base"
                        >
                          <span className="relative z-10 flex items-center">
                            <span className="hidden sm:inline">
                              Connect Wallet
                            </span>
                            <span className="sm:hidden">Connect</span>
                            <svg
                              className="w-4 h-4 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              ></path>
                            </svg>
                          </span>
                        </button>
                      )
                    }

                    if (chain?.unsupported) {
                      return (
                        <button
                          onClick={() => {
                            console.log('Wrong network button clicked', openChainModal)
                            try {
                              openChainModal()
                            } catch (error) {
                              console.error('Error opening chain modal:', error)
                            }
                          }}
                          type="button"
                          className="bg-red-900/80 text-red-400 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            ></path>
                          </svg>
                          Wrong Network
                        </button>
                      )
                    }
                    if(connected){
                      return  <div className="flex items-center space-x-1 md:space-x-2">
                      <DonationFormTrigger onSubmit={handleDonationSubmit}>
                        <button
                          type="button"
                          className="bg-primary text-primary-foreground px-3 md:px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                        >
                          <span className="hidden sm:inline">
                            新增捐款活动
                          </span>
                          <span className="sm:hidden">新增</span>
                        </button>
                      </DonationFormTrigger>
                      <button
                        onClick={() => {
                          console.log('Chain modal button clicked', openChainModal)
                          try {
                            openChainModal()
                          } catch (error) {
                            console.error('Error opening chain modal:', error)
                          }
                        }}
                        type="button"
                        className="flex items-center space-x-2 bg-gray-800 text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        <span className="text-xs md:text-sm">
                          {chain.name}
                        </span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-gray-800 text-gray-200 px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all border border-gray-700 flex items-center"
                      >
                        <span className="hidden sm:inline">
                          {account.displayName}
                        </span>
                        <span className="sm:hidden">
                          {account.displayName?.slice(0, 6)}...
                        </span>
                        {account.displayBalance && (
                          <span className="hidden md:inline ml-1 text-cyan-400">
                            {account.displayBalance}
                          </span>
                        )}
                      </button>
                    </div> 
                    } 
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  )
}
