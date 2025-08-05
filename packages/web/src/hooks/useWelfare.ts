import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useAccount } from 'wagmi'
import {
  WELFARE_CONTRACT_ADDRESS,
  WELFARE_CONTRACT_ABI,
  CampaignType,
  CampaignStatus,
  type Campaign,
  type CreateCampaignParams,
  type DonateParams,
} from '@/lib/welfare-contract'
import { Address } from 'viem'

// ============ Write Functions ============

export function useCreateCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createCampaign = (params: CreateCampaignParams) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'createCampaign',
      args: [
        params.title,
        params.description,
        params.beneficiary,
        params.targetAmount,
        params.durationInDays,
        params.campaignType,
      ],
    })
  }

  return {
    createCampaign,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useDonate() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const donate = (campaignId: bigint, amount: bigint) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'donate',
      args: [campaignId],
      value: amount,
    })
  }

  return {
    donate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useWithdrawFunds() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawFunds = (campaignId: bigint) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'withdrawFunds',
      args: [campaignId],
    })
  }

  return {
    withdrawFunds,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useRequestRefund() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const requestRefund = (campaignId: bigint) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'requestRefund',
      args: [campaignId],
    })
  }

  return {
    requestRefund,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useCancelCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const cancelCampaign = (campaignId: bigint) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'cancelCampaign',
      args: [campaignId],
    })
  }

  return {
    cancelCampaign,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useUpdatePlatformFee() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const updatePlatformFee = (newFeePercentage: bigint) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'updatePlatformFee',
      args: [newFeePercentage],
    })
  }

  return {
    updatePlatformFee,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useTransferOwnership() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const transferOwnership = (newOwner: Address) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'transferOwnership',
      args: [newOwner],
    })
  }

  return {
    transferOwnership,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useCheckAndUpdateCampaignStatus() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const checkAndUpdateCampaignStatus = (campaignId: bigint) => {
    writeContract({
      address: WELFARE_CONTRACT_ADDRESS,
      abi: WELFARE_CONTRACT_ABI,
      functionName: 'checkAndUpdateCampaignStatus',
      args: [campaignId],
    })
  }

  return {
    checkAndUpdateCampaignStatus,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// ============ Read Functions ============

export function useGetCampaignInfo(campaignId?: bigint) {
  return useReadContract({
    address: WELFARE_CONTRACT_ADDRESS,
    abi: WELFARE_CONTRACT_ABI,
    functionName: 'getCampaignInfo',
    args: campaignId ? [campaignId] : undefined,
    query: {
      enabled: !!campaignId && campaignId > BigInt(0),
    },
  }) as {
    data:
      | [
          string,
          string,
          Address,
          Address,
          bigint,
          bigint,
          bigint,
          CampaignType,
          CampaignStatus,
          boolean,
        ]
      | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useGetDonationAmount(campaignId?: bigint, donor?: Address) {
  return useReadContract({
    address: WELFARE_CONTRACT_ADDRESS,
    abi: WELFARE_CONTRACT_ABI,
    functionName: 'getDonationAmount',
    args: campaignId && donor ? [campaignId, donor] : undefined,
    query: {
      enabled: !!campaignId && !!donor && campaignId > BigInt(0),
    },
  }) as {
    data: bigint | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useGetTotalCampaigns() {
  return useReadContract({
    address: WELFARE_CONTRACT_ADDRESS,
    abi: WELFARE_CONTRACT_ABI,
    functionName: 'getTotalCampaigns',
  }) as {
    data: bigint | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useGetContractBalance() {
  return useReadContract({
    address: WELFARE_CONTRACT_ADDRESS,
    abi: WELFARE_CONTRACT_ABI,
    functionName: 'getContractBalance',
  }) as {
    data: bigint | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useGetCampaignCounter() {
  return useReadContract({
    address: WELFARE_CONTRACT_ADDRESS,
    abi: WELFARE_CONTRACT_ABI,
    functionName: 'campaignCounter',
  }) as {
    data: bigint | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useGetOwner() {
  return useReadContract({
    address: WELFARE_CONTRACT_ADDRESS,
    abi: WELFARE_CONTRACT_ABI,
    functionName: 'owner',
  }) as {
    data: Address | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useGetPlatformFeePercentage() {
  return useReadContract({
    address: WELFARE_CONTRACT_ADDRESS,
    abi: WELFARE_CONTRACT_ABI,
    functionName: 'platformFeePercentage',
  }) as {
    data: bigint | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

// ============ Utility Hooks ============

export function useGetUserDonationForCampaign(campaignId?: bigint) {
  const { address } = useAccount()
  return useGetDonationAmount(campaignId, address)
}

export function useParsedCampaignInfo(campaignId?: bigint) {
  const { data: rawData, ...rest } = useGetCampaignInfo(campaignId)

  const parsedData: Campaign | undefined = rawData
    ? {
        title: rawData[0],
        description: rawData[1],
        creator: rawData[2],
        beneficiary: rawData[3],
        targetAmount: rawData[4],
        raisedAmount: rawData[5],
        deadline: rawData[6],
        campaignType: rawData[7],
        status: rawData[8],
        fundsWithdrawn: rawData[9],
      }
    : undefined

  return {
    data: parsedData,
    ...rest,
  }
}

// ============ Main Hook ============

export function useWelfare() {
  const { address } = useAccount()

  // Write functions
  const createCampaign = useCreateCampaign()
  const donate = useDonate()
  const withdrawFunds = useWithdrawFunds()
  const requestRefund = useRequestRefund()
  const cancelCampaign = useCancelCampaign()
  const updatePlatformFee = useUpdatePlatformFee()
  const transferOwnership = useTransferOwnership()
  const checkAndUpdateCampaignStatus = useCheckAndUpdateCampaignStatus()

  // Read functions
  const totalCampaigns = useGetTotalCampaigns()
  const contractBalance = useGetContractBalance()
  const campaignCounter = useGetCampaignCounter()
  const owner = useGetOwner()
  const platformFeePercentage = useGetPlatformFeePercentage()

  // Utility functions
  const isOwner =
    address && owner.data
      ? address.toLowerCase() === owner.data.toLowerCase()
      : false

  return {
    // Write functions
    createCampaign,
    donate,
    withdrawFunds,
    requestRefund,
    cancelCampaign,
    updatePlatformFee,
    transferOwnership,
    checkAndUpdateCampaignStatus,

    // Read functions
    totalCampaigns,
    contractBalance,
    campaignCounter,
    owner,
    platformFeePercentage,
    getCampaignInfo: useGetCampaignInfo,
    getDonationAmount: useGetDonationAmount,
    getUserDonationForCampaign: useGetUserDonationForCampaign,
    getParsedCampaignInfo: useParsedCampaignInfo,

    // Utils
    address,
    contractAddress: WELFARE_CONTRACT_ADDRESS,
    isOwner,

    // Types and enums
    CampaignType,
    CampaignStatus,
  }
}

// Export types and enums for external use
export {
  CampaignType,
  CampaignStatus,
  type Campaign,
  type CreateCampaignParams,
  type DonateParams,
}
