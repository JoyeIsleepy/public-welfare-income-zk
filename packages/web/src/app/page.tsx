'use client'
import { Header } from '@/components/Header'
import { ResumeUpload } from '@/components/ResumeUpload'
import { ClientOnly } from '@/components/ClientOnly'

export default function Home() {
  return (
    <div
      className="h-screen bg-gradient-to-br to-primary/5 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 flex flex-col"
      style={{
        backgroundColor: '#111',
        backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.07) 2px, transparent 2px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.07) 2px, transparent 2px),
        linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
      `,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
      }}
    >
      <Header />
      <main className="container mx-auto pr-4 flex-1 flex flex-col">
        <ClientOnly>
          <div className="flex-1">
            <ResumeUpload />
          </div>
        </ClientOnly>
      </main>
      <footer className="bg-[#0e100f] border-t border-[#42433d] backdrop-blur shrink-0">
        <div className="container mx-auto px-4 py-5 text-center text-muted-foreground text-[#ffe1f6]">
          <p>公益溯源捐款. 基于Monad测试网构建 @copyright joeyisleepy</p>
        </div>
      </footer>
    </div>
  )
}
