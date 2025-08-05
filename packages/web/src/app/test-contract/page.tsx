'use client'

import { useState } from 'react'
import { useWelfare, CampaignType } from '@/hooks/useWelfare'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestContractPage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const welfare = useWelfare()

  const [testParams, setTestParams] = useState({
    title: 'Test Campaign',
    description: 'This is a test campaign for welfare income',
    beneficiary: '0x742d35Cc6465C4C0C6c11f8c3E6E1CC0C5C1F2b4',
    targetAmount: '1.0', // 1 ETH
    durationInDays: '30',
  })

  const [campaignIdToQuery, setCampaignIdToQuery] = useState('1')
  const [donationAmount, setDonationAmount] = useState('0.1')

  const { data: campaignInfo } = welfare.getParsedCampaignInfo(
    campaignIdToQuery ? BigInt(campaignIdToQuery) : undefined
  )

  const { data: totalCampaigns } = welfare.totalCampaigns
  const { data: contractBalance } = welfare.contractBalance
  const { data: platformFee } = welfare.platformFeePercentage

  const handleCreateCampaign = () => {
    if (!isConnected) {
      alert('请先连接钱包')
      return
    }

    welfare.createCampaign.createCampaign({
      title: testParams.title,
      description: testParams.description,
      beneficiary: testParams.beneficiary as `0x${string}`,
      targetAmount: parseEther(testParams.targetAmount),
      durationInDays: BigInt(testParams.durationInDays),
      campaignType: CampaignType.DisasterRelief,
    })
  }

  const handleDonate = () => {
    if (!isConnected) {
      alert('请先连接钱包')
      return
    }

    if (!campaignIdToQuery) {
      alert('请输入活动ID')
      return
    }

    welfare.donate.donate(BigInt(campaignIdToQuery), parseEther(donationAmount))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">合约功能测试</h1>

      {/* 钱包连接状态 */}
      <Card>
        <CardHeader>
          <CardTitle>钱包连接</CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-2">
              <p>已连接钱包: {address}</p>
              <p>是否为合约拥有者: {welfare.isOwner ? '是' : '否'}</p>
              <Button onClick={() => disconnect()}>断开连接</Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p>未连接钱包</p>
              {connectors.map(connector => (
                <Button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                >
                  连接 {connector.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 合约状态 */}
      <Card>
        <CardHeader>
          <CardTitle>合约状态</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>合约地址: {welfare.contractAddress}</p>
          <p>总活动数: {totalCampaigns?.toString() || '加载中...'}</p>
          <p>
            合约余额: {contractBalance ? formatEther(contractBalance) : '0'} ETH
          </p>
          <p>平台费率: {platformFee?.toString() || '0'}%</p>
        </CardContent>
      </Card>

      {/* 创建活动测试 */}
      <Card>
        <CardHeader>
          <CardTitle>创建活动测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>标题:</label>
              <Input
                value={testParams.title}
                onChange={e =>
                  setTestParams(prev => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label>目标金额 (ETH):</label>
              <Input
                type="number"
                step="0.1"
                value={testParams.targetAmount}
                onChange={e =>
                  setTestParams(prev => ({
                    ...prev,
                    targetAmount: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label>受益人地址:</label>
              <Input
                value={testParams.beneficiary}
                onChange={e =>
                  setTestParams(prev => ({
                    ...prev,
                    beneficiary: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label>持续天数:</label>
              <Input
                type="number"
                value={testParams.durationInDays}
                onChange={e =>
                  setTestParams(prev => ({
                    ...prev,
                    durationInDays: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label>描述:</label>
            <Input
              value={testParams.description}
              onChange={e =>
                setTestParams(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <Button
            onClick={handleCreateCampaign}
            disabled={
              welfare.createCampaign.isPending ||
              welfare.createCampaign.isConfirming
            }
          >
            {welfare.createCampaign.isPending ||
            welfare.createCampaign.isConfirming
              ? '创建中...'
              : '创建活动'}
          </Button>

          {welfare.createCampaign.error && (
            <p className="text-red-500">
              错误: {welfare.createCampaign.error.message}
            </p>
          )}

          {welfare.createCampaign.isSuccess && (
            <p className="text-green-500">活动创建成功！</p>
          )}
        </CardContent>
      </Card>

      {/* 查询活动信息 */}
      <Card>
        <CardHeader>
          <CardTitle>查询活动信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label>活动ID:</label>
            <Input
              type="number"
              value={campaignIdToQuery}
              onChange={e => setCampaignIdToQuery(e.target.value)}
            />
          </div>

          {campaignInfo && (
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <h3 className="font-bold">活动信息:</h3>
              <p>标题: {campaignInfo.title}</p>
              <p>描述: {campaignInfo.description}</p>
              <p>创建者: {campaignInfo.creator}</p>
              <p>受益人: {campaignInfo.beneficiary}</p>
              <p>目标金额: {formatEther(campaignInfo.targetAmount)} ETH</p>
              <p>已筹集金额: {formatEther(campaignInfo.raisedAmount)} ETH</p>
              <p>
                截止时间:{' '}
                {new Date(
                  Number(campaignInfo.deadline) * 1000
                ).toLocaleString()}
              </p>
              <p>
                活动类型:{' '}
                {campaignInfo.campaignType === CampaignType.DisasterRelief
                  ? '灾难救助'
                  : '贫困救助'}
              </p>
              <p>
                状态:{' '}
                {campaignInfo.status === 0
                  ? '进行中'
                  : campaignInfo.status === 1
                    ? '已完成'
                    : campaignInfo.status === 2
                      ? '已取消'
                      : '失败'}
              </p>
              <p>资金是否已提取: {campaignInfo.fundsWithdrawn ? '是' : '否'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 捐款测试 */}
      <Card>
        <CardHeader>
          <CardTitle>捐款测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>活动ID:</label>
              <Input
                type="number"
                value={campaignIdToQuery}
                onChange={e => setCampaignIdToQuery(e.target.value)}
              />
            </div>
            <div>
              <label>捐款金额 (ETH):</label>
              <Input
                type="number"
                step="0.01"
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleDonate}
            disabled={welfare.donate.isPending || welfare.donate.isConfirming}
          >
            {welfare.donate.isPending || welfare.donate.isConfirming
              ? '捐款中...'
              : '捐款'}
          </Button>

          {welfare.donate.error && (
            <p className="text-red-500">错误: {welfare.donate.error.message}</p>
          )}

          {welfare.donate.isSuccess && (
            <p className="text-green-500">捐款成功！</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
