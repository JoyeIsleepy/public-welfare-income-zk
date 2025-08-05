# 合约调用问题分析与解决方案

## 🔍 问题分析

### 1. **主要问题**

- ❌ 合约地址无效：在 `0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496` 地址上没有部署合约
- ❌ 参数类型不匹配：表单数据格式与合约参数不一致
- ❌ 调用方式错误：`useCreateCampaign` hook 使用不正确
- ❌ 缺少状态管理：没有正确处理 loading 和 error 状态

### 2. **错误详情**

#### 原来的调用方式 (错误)：

```tsx
const { createCampaign: createCampaignWelfare } = useCreateCampaign()
await createCampaignWelfare(formData) // ❌ 错误
```

#### 参数类型问题：

```tsx
// formData 中的字段类型不匹配
{
  targetAmount: "1.0",        // string → 需要 bigint
  durationInDays: "30",       // string → 需要 bigint
  beneficiary: "0x...",       // 可能无效地址
}
```

## ✅ 已修复的问题

### 1. **修复了 DonationForm.tsx 调用方式**

```tsx
// 正确的 hook 使用
const { createCampaign, isPending, isConfirming, isSuccess, error } =
  useCreateCampaign()

// 正确的参数转换和调用
const campaignParams = {
  title: formData.title.trim(),
  description: formData.description.trim(),
  beneficiary: formData.beneficiary as Address,
  targetAmount: parseEther(formData.targetAmount),
  durationInDays: BigInt(formData.durationInDays),
  campaignType: formData.campaignType,
}

createCampaign(campaignParams) // ✅ 正确
```

### 2. **添加了完整的表单验证**

```tsx
// 地址验证
if (!formData.beneficiary.trim() || !isAddress(formData.beneficiary)) {
  toast.error('请输入有效的受益人地址')
  return
}

// 金额验证
if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
  toast.error('请输入有效的目标金额')
  return
}
```

### 3. **修复了状态管理**

```tsx
// 使用 useEffect 监听状态变化
useEffect(() => {
  if (isSuccess) {
    toast.success('捐款活动创建成功！')
    // 处理成功逻辑...
  }
}, [isSuccess])

useEffect(() => {
  if (error) {
    toast.error(error.message || '创建捐款活动失败，请重试')
  }
}, [error])
```

### 4. **添加了缺失的表单字段**

```tsx
<div className="space-y-2">
  <label htmlFor="durationInDays" className="text-sm font-medium">
    持续天数 *
  </label>
  <Input
    id="durationInDays"
    type="number"
    min="1"
    max="365"
    placeholder="30"
    value={formData.durationInDays}
    onChange={e => handleInputChange('durationInDays', e.target.value)}
    required
  />
</div>
```

### 5. **创建了测试页面**

创建了 `/test-contract` 页面用于测试所有合约功能：

- 钱包连接状态
- 合约状态查询
- 创建活动测试
- 捐款功能测试
- 查询活动信息

## 🚀 部署解决方案

### 方案一：部署到 Monad 测试网 (推荐)

1. **准备私钥和 MON 代币**

   ```bash
   # 设置环境变量
   export PRIVATE_KEY="your_private_key"
   export MONADTEST_RPC_URL="https://testnet-rpc.monad.xyz"
   ```

2. **部署合约**

   ```bash
   cd packages/contracts
   forge script script/deploy.sol --rpc-url monadtest --broadcast --private-key $PRIVATE_KEY
   ```

3. **更新合约地址**
   在 `packages/web/src/lib/welfare-contract.ts` 中更新：
   ```typescript
   export const WELFARE_CONTRACT_ADDRESS = '0x新部署的合约地址' as Address
   ```

### 方案二：使用本地测试网络

1. **启动本地区块链**

   ```bash
   anvil --port 8545 --chain-id 31337 --host 0.0.0.0
   ```

2. **部署到本地网络**

   ```bash
   forge script script/deploy.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

3. **更新网络配置**
   在 `packages/web/src/lib/wagmi.ts` 中添加本地网络：

   ```typescript
   import { localhost } from 'wagmi/chains'

   export const config = getDefaultConfig({
     appName: 'Resume ZK',
     projectId,
     chains: [monadtest, localhost], // 添加 localhost
     ssr: true,
   })
   ```

## 🧪 测试步骤

1. **启动应用**

   ```bash
   cd packages/web
   npm run dev
   ```

2. **访问测试页面**
   打开 `http://localhost:3000/test-contract`

3. **连接钱包**
   - 点击连接钱包按钮
   - 选择 MetaMask 或其他钱包

4. **测试合约功能**
   - 查看合约状态（地址、余额、活动数量等）
   - 测试创建活动
   - 测试捐款功能
   - 测试查询活动信息

## ⚠️ 注意事项

1. **网络配置**：确保钱包连接到正确的网络（Monad Testnet 或 Localhost）
2. **Gas 费用**：确保账户有足够的 MON 代币支付 gas 费用
3. **合约地址**：务必使用实际部署的合约地址
4. **参数验证**：表单会进行前端验证，但仍需注意输入有效数据

## 📊 当前状态

- ✅ 前端代码已修复
- ✅ 参数转换正确
- ✅ 状态管理完善
- ✅ 表单验证完整
- ✅ 测试页面可用
- ⏳ 需要部署合约到网络
- ⏳ 需要更新正确的合约地址

## 🔗 相关文件

- `packages/web/src/components/DonationForm.tsx` - 主要表单组件
- `packages/web/src/hooks/useWelfare.ts` - 合约交互 hooks
- `packages/web/src/lib/welfare-contract.ts` - 合约配置和 ABI
- `packages/web/src/app/test-contract/page.tsx` - 测试页面
- `packages/contracts/script/deploy.sol` - 部署脚本
- `packages/contracts/script/verify.sol` - 合约验证脚本
