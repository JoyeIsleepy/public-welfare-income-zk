import { type Address } from 'viem'

export const WELFARE_CONTRACT_ADDRESS =
  '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519' as Address

export const WELFARE_CONTRACT_ABI = [
  // Write functions
  {
    type: 'function',
    name: 'createCampaign',
    inputs: [
      { name: '_title', type: 'string', internalType: 'string' },
      { name: '_description', type: 'string', internalType: 'string' },
      {
        name: '_beneficiary',
        type: 'address',
        internalType: 'address payable',
      },
      { name: '_targetAmount', type: 'uint256', internalType: 'uint256' },
      { name: '_durationInDays', type: 'uint256', internalType: 'uint256' },
      {
        name: '_campaignType',
        type: 'uint8',
        internalType: 'enum WelfareIncome.CampaignType',
      },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'donate',
    inputs: [{ name: '_campaignId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'withdrawFunds',
    inputs: [{ name: '_campaignId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'requestRefund',
    inputs: [{ name: '_campaignId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelCampaign',
    inputs: [{ name: '_campaignId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updatePlatformFee',
    inputs: [
      { name: '_newFeePercentage', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: '_newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkAndUpdateCampaignStatus',
    inputs: [{ name: '_campaignId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },

  // Read functions
  {
    type: 'function',
    name: 'getCampaignInfo',
    inputs: [{ name: '_campaignId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'title', type: 'string', internalType: 'string' },
      { name: 'description', type: 'string', internalType: 'string' },
      { name: 'creator', type: 'address', internalType: 'address' },
      { name: 'beneficiary', type: 'address', internalType: 'address' },
      { name: 'targetAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'raisedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'deadline', type: 'uint256', internalType: 'uint256' },
      {
        name: 'campaignType',
        type: 'uint8',
        internalType: 'enum WelfareIncome.CampaignType',
      },
      {
        name: 'status',
        type: 'uint8',
        internalType: 'enum WelfareIncome.CampaignStatus',
      },
      { name: 'fundsWithdrawn', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getDonationAmount',
    inputs: [
      { name: '_campaignId', type: 'uint256', internalType: 'uint256' },
      { name: '_donor', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalCampaigns',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getContractBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'campaignCounter',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'platformFeePercentage',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },

  // Events
  {
    type: 'event',
    name: 'CampaignCreated',
    inputs: [
      {
        name: 'campaignId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'creator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'beneficiary',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      { name: 'title', type: 'string', indexed: false, internalType: 'string' },
      {
        name: 'targetAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'deadline',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'campaignType',
        type: 'uint8',
        indexed: false,
        internalType: 'enum WelfareIncome.CampaignType',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DonationMade',
    inputs: [
      {
        name: 'campaignId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'donor',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'totalRaised',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FundsWithdrawn',
    inputs: [
      {
        name: 'campaignId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'beneficiary',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'platformFee',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CampaignStatusChanged',
    inputs: [
      {
        name: 'campaignId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'oldStatus',
        type: 'uint8',
        indexed: false,
        internalType: 'enum WelfareIncome.CampaignStatus',
      },
      {
        name: 'newStatus',
        type: 'uint8',
        indexed: false,
        internalType: 'enum WelfareIncome.CampaignStatus',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RefundMade',
    inputs: [
      {
        name: 'campaignId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'donor',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
] as const

// Enums
export enum CampaignStatus {
  Active = 0, // 进行中
  Completed = 1, // 已完成
  Cancelled = 2, // 已取消
  Failed = 3, // 失败（未达到目标且时间过期）
}

export enum CampaignType {
  DisasterRelief = 0, // 自然灾害救助
  PovertyAlleviation = 1, // 贫困救助
}

// Types
export interface Campaign {
  title: string
  description: string
  creator: Address
  beneficiary: Address
  targetAmount: bigint
  raisedAmount: bigint
  deadline: bigint
  campaignType: CampaignType
  status: CampaignStatus
  fundsWithdrawn: boolean
}

export interface CreateCampaignParams {
  title: string
  description: string
  beneficiary: Address
  targetAmount: bigint
  durationInDays: bigint
  campaignType: CampaignType
}

export interface DonateParams {
  campaignId: bigint
  amount: bigint
}
