import { type Address } from 'viem'

export const RESUME_ZK_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_RESUME_ZK_CONTRACT_ADDRESS as Address

export const RESUME_ZK_ABI = [
  {
    "type": "function",
    "name": "submitResume",
    "inputs": [
      { "name": "resumeHash", "type": "bytes32", "internalType": "bytes32" },
      { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "verifyResume",
    "inputs": [
      { "name": "resumeHash", "type": "bytes32", "internalType": "bytes32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getResume",
    "inputs": [
      { "name": "resumeHash", "type": "bytes32", "internalType": "bytes32" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ResumeZK.Resume",
        "components": [
          { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" },
          { "name": "owner", "type": "address", "internalType": "address" },
          { "name": "timestamp", "type": "uint256", "internalType": "uint256" },
          { "name": "verified", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserResumes",
    "inputs": [
      { "name": "user", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "bytes32[]", "internalType": "bytes32[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "storeCredential",
    "inputs": [
      { "name": "credType", "type": "uint8", "internalType": "enum ResumeZK.CredentialType" },
      { "name": "dataHash", "type": "string", "internalType": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getUserCredential",
    "inputs": [
      { "name": "user", "type": "address", "internalType": "address" },
      { "name": "credType", "type": "uint8", "internalType": "enum ResumeZK.CredentialType" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ResumeZK.Credential",
        "components": [
          { "name": "credType", "type": "uint8", "internalType": "enum ResumeZK.CredentialType" },
          { "name": "dataHash", "type": "string", "internalType": "string" },
          { "name": "timestamp", "type": "uint256", "internalType": "uint256" },
          { "name": "verified", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasCredential",
    "inputs": [
      { "name": "user", "type": "address", "internalType": "address" },
      { "name": "credType", "type": "uint8", "internalType": "enum ResumeZK.CredentialType" }
    ],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ResumeSubmitted",
    "inputs": [
      { "name": "resumeHash", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
      { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "merkleRoot", "type": "bytes32", "indexed": false, "internalType": "bytes32" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ResumeVerified",
    "inputs": [
      { "name": "resumeHash", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
      { "name": "verifier", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CredentialStored",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "credType", "type": "uint8", "indexed": false, "internalType": "enum ResumeZK.CredentialType" },
      { "name": "dataHash", "type": "string", "indexed": false, "internalType": "string" }
    ],
    "anonymous": false
  }
] as const

export enum CredentialType {
  DEGREE = 0,
  CET4 = 1,
  CET6 = 2
}

export interface Resume {
  merkleRoot: string
  owner: string
  timestamp: bigint
  verified: boolean
}

export interface Credential {
  credType: CredentialType
  dataHash: string
  timestamp: bigint
  verified: boolean
}