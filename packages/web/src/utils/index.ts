import { keccak256, toBytes } from 'viem'

export function hashResumeData(data: any): string {
  const serialized = JSON.stringify(data, Object.keys(data).sort())
  return keccak256(toBytes(serialized))
}

export function generateMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) return '0x'
  if (leaves.length === 1) return leaves[0]
  
  let currentLevel = leaves
  
  while (currentLevel.length > 1) {
    const nextLevel: string[] = []
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i]
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left
      
      const combined = left < right ? left + right.slice(2) : right + left.slice(2)
      nextLevel.push(keccak256(toBytes(combined)))
    }
    
    currentLevel = nextLevel
  }
  
  return currentLevel[0]
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function validateEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}