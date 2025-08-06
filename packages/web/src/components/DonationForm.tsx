'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CampaignType, useCreateCampaign } from '@/hooks/useWelfare'
import { toast } from 'react-hot-toast'
import { Address, parseEther, isAddress } from 'viem'

interface DonationFormData {
  title: string
  description: string
  beneficiary: Address
  targetAmount: string
  deadline: string
  category: string
  contactInfo: string
  source: string
  durationInDays: string
  campaignType: CampaignType
}

interface DonationFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: DonationFormData) => void
}

export function DonationForm({
  isOpen,
  onOpenChange,
  onSubmit,
}: DonationFormProps) {
  const [formData, setFormData] = useState<DonationFormData>({
    title: '',
    description: '',
    beneficiary: '' as Address,
    targetAmount: '',
    deadline: '',
    category: '',
    contactInfo: '',
    source: '',
    durationInDays: '30',
    campaignType: CampaignType.DisasterRelief,
  })

  const { createCampaign, isPending, isConfirming, isSuccess, error } =
    useCreateCampaign()

  const isLoading = isPending || isConfirming

  const handleInputChange = (field: keyof DonationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 表单验证
      if (!formData.title.trim()) {
        toast.error('请输入活动标题')
        return
      }

      if (!formData.description.trim()) {
        toast.error('请输入活动描述')
        return
      }

      if (!formData.beneficiary.trim() || !isAddress(formData.beneficiary)) {
        toast.error('请输入有效的受益人地址')
        return
      }

      if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
        toast.error('请输入有效的目标金额')
        return
      }

      if (!formData.durationInDays || parseInt(formData.durationInDays) <= 0) {
        toast.error('请输入有效的持续天数')
        return
      }

      // 转换参数格式
      const campaignParams = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        beneficiary: formData.beneficiary as Address,
        targetAmount: parseEther(formData.targetAmount),
        durationInDays: BigInt(formData.durationInDays),
        campaignType: formData.campaignType,
      }

      console.log('Creating campaign with params:', campaignParams)

      // 调用智能合约创建捐款活动
      createCampaign(campaignParams)
    } catch (error: any) {
      // 显示错误提示
      toast.error(error.message || '创建捐款活动失败，请重试')
      console.error('创建捐款活动失败:', error)
    }
  }

  // 监听成功和错误状态
  useEffect(() => {
    if (isSuccess) {
      toast.success('捐款活动创建成功！')

      // 调用父组件回调
      onSubmit(formData)

      // 重置表单
      setFormData({
        title: '',
        description: '',
        beneficiary: '' as Address,
        targetAmount: '',
        deadline: '',
        category: '',
        contactInfo: '',
        source: '',
        durationInDays: '30',
        campaignType: CampaignType.DisasterRelief,
      })

      // 关闭弹窗
      onOpenChange(false)
    }
  }, [isSuccess, formData, onSubmit, onOpenChange])

  useEffect(() => {
    if (error) {
      toast.error(error.message || '创建捐款活动失败，请重试')
      console.error('创建捐款活动失败:', error)
    }
  }, [error])

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.beneficiary.trim() &&
    isAddress(formData.beneficiary) &&
    formData.targetAmount.trim() &&
    parseFloat(formData.targetAmount) > 0 &&
    formData.durationInDays.trim() &&
    parseInt(formData.durationInDays) > 0 &&
    formData.category.trim()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建捐款活动</DialogTitle>
          <DialogDescription>填写以下信息来创建新的捐款活动</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              活动标题 *
            </label>
            <Input
              id="title"
              placeholder="请输入捐款活动标题"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              活动描述 *
            </label>
            <textarea
              id="description"
              placeholder="请详细描述捐款活动的目的、用途等信息"
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="beneficiary" className="text-sm font-medium">
              受益人地址 *
            </label>
            <Input
              id="beneficiary"
              placeholder="请输入受益人钱包地址 (0x...)"
              value={formData.beneficiary}
              onChange={e => handleInputChange('beneficiary', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="targetAmount" className="text-sm font-medium">
                目标金额 (ETH) *
              </label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={e =>
                  handleInputChange('targetAmount', e.target.value)
                }
                required
              />
            </div>

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
                onChange={e =>
                  handleInputChange('durationInDays', e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              活动类别 *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={e => handleInputChange('category', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">请选择活动类别</option>
              <option value="education">教育助学</option>
              <option value="medical">医疗救助</option>
              <option value="disaster">灾难救助</option>
              <option value="poverty">扶贫济困</option>
              <option value="elderly">养老助老</option>
              <option value="environment">环境保护</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              相关资料链接
            </label>
            <Input
              id="source"
              placeholder="请输入相关资料或证明文件的URL（可选）"
              value={formData.source}
              onChange={e => handleInputChange('source', e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-primary text-primary-foreground"
            >
              {isLoading ? '创建中...' : '创建活动'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// 可以单独导出触发按钮组件
interface DonationFormTriggerProps {
  children: React.ReactNode
  onSubmit: (data: DonationFormData) => void
}

export function DonationFormTrigger({
  children,
  onSubmit,
}: DonationFormTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <DonationForm
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={onSubmit}
      />
    </>
  )
}
