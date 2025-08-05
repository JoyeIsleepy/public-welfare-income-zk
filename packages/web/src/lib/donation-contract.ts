import { type Address } from 'viem'

export const DONATION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as Address

export const DONATION_ABI = [
  {
    "type": "function",
    "name": "createCampaign",
    "inputs": [
      { "name": "title", "type": "string", "internalType": "string" },
      { "name": "description", "type": "string", "internalType": "string" },
      { "name": "beneficiary", "type": "address", "internalType": "address payable" },
      { "name": "targetAmount", "type": "uint256", "internalType": "uint256" },
      { "name": "deadline", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "donate",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdrawFunds",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCampaign",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct DonationContract.Campaign",
        "components": [
          { "name": "id", "type": "uint256", "internalType": "uint256" },
          { "name": "title", "type": "string", "internalType": "string" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "creator", "type": "address", "internalType": "address" },
          { "name": "beneficiary", "type": "address", "internalType": "address payable" },
          { "name": "targetAmount", "type": "uint256", "internalType": "uint256" },
          { "name": "raisedAmount", "type": "uint256", "internalType": "uint256" },
          { "name": "deadline", "type": "uint256", "internalType": "uint256" },
          { "name": "fundsWithdrawn", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllCampaigns",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCampaignsByCreator",
    "inputs": [
      { "name": "creator", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "CampaignCreated",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "creator", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "beneficiary", "type": "address", "indexed": true, "internalType": "address payable" },
      { "name": "title", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "targetAmount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "deadline", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DonationReceived",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "donor", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FundsWithdrawn",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "beneficiary", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const

export interface Campaign {
  id: bigint
  title: string
  description: string
  creator: Address
  beneficiary: Address
  targetAmount: bigint
  raisedAmount: bigint
  deadline: bigint
  fundsWithdrawn: boolean
}

export interface CreateCampaignData {
  title: string
  description: string
  beneficiary: Address
  targetAmount: bigint
  deadline: bigint
}