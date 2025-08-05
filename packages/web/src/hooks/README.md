# WelfareIncome Contract Hooks

这个文件包含了与 `WelfareIncome` 合约交互的 React hooks。

## 安装和配置

### 1. 环境变量设置

在你的 `.env.local` 文件中添加合约地址：

```env
NEXT_PUBLIC_WELFARE_CONTRACT_ADDRESS=0x...
```

### 2. 主要 Hook

```tsx
import { useWelfare } from '@/hooks/useWelfare'

function MyComponent() {
  const welfare = useWelfare()

  // 使用各种功能...
}
```

## 功能概览

### 写操作 (Write Functions)

#### `createCampaign`

创建新的慈善活动：

```tsx
const { createCampaign } = useWelfare()

const handleCreate = () => {
  createCampaign.createCampaign({
    title: '地震救助活动',
    description: '为地震灾区提供紧急救助',
    beneficiary: '0x...',
    targetAmount: parseEther('10'), // 10 ETH
    durationInDays: BigInt(30), // 30天
    campaignType: CampaignType.DisasterRelief,
  })
}
```

#### `donate`

向活动捐款：

```tsx
const { donate } = useWelfare()

const handleDonate = () => {
  donate.donate(
    BigInt(1), // 活动ID
    parseEther('0.1') // 捐款金额 0.1 ETH
  )
}
```

#### `withdrawFunds`

受益人提取资金：

```tsx
const { withdrawFunds } = useWelfare()

const handleWithdraw = () => {
  withdrawFunds.withdrawFunds(BigInt(1)) // 活动ID
}
```

#### `requestRefund`

申请退款（活动失败时）：

```tsx
const { requestRefund } = useWelfare()

const handleRefund = () => {
  requestRefund.requestRefund(BigInt(1)) // 活动ID
}
```

#### `cancelCampaign`

取消活动（仅创建者）：

```tsx
const { cancelCampaign } = useWelfare()

const handleCancel = () => {
  cancelCampaign.cancelCampaign(BigInt(1)) // 活动ID
}
```

### 读操作 (Read Functions)

#### `getParsedCampaignInfo`

获取格式化的活动信息：

```tsx
const { getParsedCampaignInfo } = useWelfare()
const { data: campaign } = getParsedCampaignInfo(BigInt(1))

if (campaign) {
  console.log({
    title: campaign.title,
    description: campaign.description,
    targetAmount: campaign.targetAmount,
    raisedAmount: campaign.raisedAmount,
    status: campaign.status,
    // ...更多字段
  })
}
```

#### `getUserDonationForCampaign`

获取当前用户对特定活动的捐款金额：

```tsx
const { getUserDonationForCampaign } = useWelfare()
const { data: donationAmount } = getUserDonationForCampaign(BigInt(1))
```

#### `totalCampaigns`

获取活动总数：

```tsx
const { totalCampaigns } = useWelfare()
console.log('总活动数:', totalCampaigns.data)
```

### 管理功能（仅合约拥有者）

#### `updatePlatformFee`

更新平台费用：

```tsx
const { updatePlatformFee, isOwner } = useWelfare()

if (isOwner) {
  updatePlatformFee.updatePlatformFee(BigInt(3)) // 设置为3%
}
```

#### `transferOwnership`

转移合约所有权：

```tsx
const { transferOwnership, isOwner } = useWelfare()

if (isOwner) {
  transferOwnership.transferOwnership('0x...') // 新拥有者地址
}
```

## 类型和枚举

### CampaignType

```tsx
enum CampaignType {
  DisasterRelief = 0, // 自然灾害救助
  PovertyAlleviation = 1, // 贫困救助
}
```

### CampaignStatus

```tsx
enum CampaignStatus {
  Active = 0, // 进行中
  Completed = 1, // 已完成
  Cancelled = 2, // 已取消
  Failed = 3, // 失败（未达到目标且时间过期）
}
```

### Campaign Interface

```tsx
interface Campaign {
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
```

## 完整示例

```tsx
import { useWelfare, CampaignType } from '@/hooks/useWelfare'
import { parseEther, formatEther } from 'viem'

export function CampaignManager() {
  const welfare = useWelfare()
  const { data: totalCampaigns } = welfare.totalCampaigns
  const { data: campaign } = welfare.getParsedCampaignInfo(BigInt(1))

  const createNewCampaign = () => {
    welfare.createCampaign.createCampaign({
      title: '洪水救助',
      description: '为洪水受灾地区提供援助',
      beneficiary: '0x742d35Cc6465C4C0C6c11f8c3E6E1CC0C5C1F2b4',
      targetAmount: parseEther('5'),
      durationInDays: BigInt(60),
      campaignType: CampaignType.DisasterRelief,
    })
  }

  const donateToCampaign = () => {
    welfare.donate.donate(BigInt(1), parseEther('0.5'))
  }

  return (
    <div>
      <h2>慈善活动管理</h2>
      <p>总活动数: {totalCampaigns?.toString()}</p>

      {campaign && (
        <div>
          <h3>{campaign.title}</h3>
          <p>{campaign.description}</p>
          <p>目标: {formatEther(campaign.targetAmount)} ETH</p>
          <p>已筹集: {formatEther(campaign.raisedAmount)} ETH</p>
          <p>状态: {campaign.status}</p>
        </div>
      )}

      <button onClick={createNewCampaign}>创建活动</button>
      <button onClick={donateToCampaign}>捐款 0.5 ETH</button>
    </div>
  )
}
```

## 注意事项

1. 所有金额都使用 `bigint` 类型，单位为 wei
2. 使用 `parseEther()` 和 `formatEther()` 进行 ETH 单位转换
3. 写操作需要用户确认交易
4. 读操作会自动缓存和更新数据
5. 使用 `isOwner` 检查当前用户是否为合约拥有者
