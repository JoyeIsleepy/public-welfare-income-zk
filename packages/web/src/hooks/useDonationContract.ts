'use client'

import { useState } from 'react'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { parseEther, isAddress } from 'viem'
import { DONATION_ABI, DONATION_CONTRACT_ADDRESS, type CreateCampaignData } from '@/lib/donation-contract'

export function useDonationContract() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createCampaign = async (data: {
    title: string
    description: string
    beneficiary: string
    targetAmount: string
    deadline: string
    category: string
    contactInfo: string
    source: string
  }) => {
    try {
      setIsLoading(true)
      
      // 验证输入数据
      if (!data.title.trim()) {
        throw new Error('活动标题不能为空')
      }
      
      if (!data.description.trim()) {
        throw new Error('活动描述不能为空')
      }
      
      if (!isAddress(data.beneficiary)) {
        throw new Error('受益人地址格式不正确')
      }
      
      const targetAmountWei = parseEther(data.targetAmount)
      if (targetAmountWei <= 0) {
        throw new Error('目标金额必须大于0')
      }
      
      // 将日期时间转换为Unix时间戳
      const deadlineTimestamp = Math.floor(new Date(data.deadline).getTime() / 1000)
      const currentTimestamp = Math.floor(Date.now() / 1000)
      
      if (deadlineTimestamp <= currentTimestamp) {
        throw new Error('截止时间必须在当前时间之后')
      }

      // 调用智能合约
      const result = await writeContract({
        address: DONATION_CONTRACT_ADDRESS,
        abi: DONATION_ABI,
        functionName: 'createCampaign',
        args: [
          data.title,
          data.description,
          data.beneficiary as `0x${string}`,
          targetAmountWei,
          BigInt(deadlineTimestamp)
        ]
      })

      return result
    } catch (error) {
      console.error('创建捐款活动失败:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const donate = async (campaignId: bigint, amount: string) => {
    try {
      setIsLoading(true)
      
      const amountWei = parseEther(amount)
      if (amountWei <= 0) {
        throw new Error('捐款金额必须大于0')
      }

      const result = await writeContract({
        address: DONATION_CONTRACT_ADDRESS,
        abi: DONATION_ABI,
        functionName: 'donate',
        args: [campaignId],
        value: amountWei
      })

      return result
    } catch (error) {
      console.error('捐款失败:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const withdrawFunds = async (campaignId: bigint) => {
    try {
      setIsLoading(true)

      const result = await writeContract({
        address: DONATION_CONTRACT_ADDRESS,
        abi: DONATION_ABI,
        functionName: 'withdrawFunds',
        args: [campaignId]
      })

      return result
    } catch (error) {
      console.error('提取资金失败:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createCampaign,
    donate,
    withdrawFunds,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    error,
    hash,
    address
  }
}