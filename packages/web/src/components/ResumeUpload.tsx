'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { AlertCircle } from 'lucide-react'

interface Campaign {
  id: number
  title: string
  description: string
  creator: string
  beneficiary: string
  targetAmount: number
  raisedAmount: number
  deadline: number
  status: string
  fundsWithdrawn: boolean
}

export function ResumeUpload() {
  const [mounted, setMounted] = useState(false)
  const account = useAccount()
  const [contractList, setContractList] = useState<Campaign[]>([])
  const [selectedContract, setSelectedContract] = useState<Campaign | null>(
    null
  )

  const isConnected = mounted ? account.isConnected : false

  useEffect(() => {
    // 读取并处理初始数据
    const updateFromLocalStorage = () => {
      const existingData = localStorage.getItem('monad-store')
      let dataArray = existingData ? JSON.parse(existingData) : []
      dataArray = dataArray.map((item: any) => ({
        ...item,
        id: item.id || crypto.randomUUID(),
      }))
      setContractList(dataArray)
    }

    // 初始加载
    updateFromLocalStorage()

    // 添加storage事件监听器
    const handleStorageChange = (event: any) => {
      if (event.key === 'monad-store') {
        updateFromLocalStorage()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto pt-24">
        <div className="glass-morphism rounded-2xl p-4 md:p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">请先连接钱包</h3>
            <p className="text-muted-foreground">
              您需要连接到Monad测试网才能查看活动数据
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* 左侧列表 */}
      <div className="w-1/3 border-r border-[#42433d] bg-gray-900 bg-opacity-70 overflow-y-auto">
        <div className="p-4 font-semibold text-lg border-b border-[#42433d]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
            公益合约列表
          </span>
          <div className="flex items-center mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            <span className="text-xs text-gray-400">
              Connected to Monad Testnet
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-700">
          {contractList.map((item, index) => (
            <div
              key={index}
              className={`p-4 hover:bg-gray-700 cursor-pointer transition-all duration-200 ${
                selectedContract?.id === item.id
                  ? 'bg-gray-700 border-l-4 border-cyan-400'
                  : ''
              }`}
              onClick={() => setSelectedContract(item)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-100">{item.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === '进行中'
                      ? 'bg-cyan-900 text-cyan-400'
                      : 'bg-purple-900 text-purple-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1 truncate">
                {item.description}
              </p>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (item.raisedAmount / item.targetAmount) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-cyan-400 font-mono">
                    {item.raisedAmount} ETH
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {item.targetAmount} ETH
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-1"></span>
                <span className="text-xs text-gray-400">
                  {new Date(item.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧详情 */}
      <div className="w-2/3 overflow-y-auto p-6">
        {selectedContract ? (
          <div className="bg-gray-900 bg-opacity-70  rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              {selectedContract.title}
            </h2>
            <p className="mt-2 text-gray-400">{selectedContract.description}</p>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"> 
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">受益人</h3>
                  <p className="mt-2 text-sm text-cyan-400 font-mono break-all">
                    {selectedContract.beneficiary}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">
                    目标金额
                  </h3>
                  <p className="mt-2 text-sm text-white font-mono">
                    {selectedContract.targetAmount} ETH
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">已筹集</h3>
                  <div className="mt-2">
                    <p className="text-sm text-white font-mono">
                      {selectedContract.raisedAmount} ETH
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${Math.round(
                            (selectedContract.raisedAmount /
                              selectedContract.targetAmount) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(
                        (selectedContract.raisedAmount /
                          selectedContract.targetAmount) *
                          100
                      )}
                      % 达成
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">
                    截止时间
                  </h3>
                  <div className="mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 text-purple-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-sm text-white">
                      {new Date(selectedContract.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">状态</h3>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedContract.status === '进行中'
                          ? 'bg-cyan-900 text-cyan-400'
                          : 'bg-purple-900 text-purple-400'
                      }`}
                    >
                      {selectedContract.status}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400">
                资金提取状态
              </h3>
              <div className="mt-2 flex items-center">
                {selectedContract.fundsWithdrawn ? (
                  <>
                    <svg
                      className="w-5 h-5 text-green-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-green-400">已提取</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-2"
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
                    <span className="text-yellow-400">未提取</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p className="text-gray-500">请从左侧选择合约查看详情</p>
            <p className="text-sm text-gray-600 mt-2">
              连接钱包后可查看您创建的合约
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
