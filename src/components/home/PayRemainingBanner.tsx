'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatINR } from '@/data/products'
import useFetchApi from '@/hooks/useFetchApi'

type PendingBalance = {
  orderId: string
  balanceAmount: string
  balancePaid: boolean
  estimatedDeliveryEnd: string | null
}

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PayRemainingBanner() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const { data } = useFetchApi<PendingBalance[]>({
    endpoint: 'v1/orders/pending-balance',
    cacheEnabled: false,
  })

  const unpaidOrders = data?.filter((o) => !o.balancePaid && parseFloat(o.balanceAmount) > 0) ?? []
  if (!unpaidOrders.length) return null

  const safeIndex = activeIndex % unpaidOrders.length
  const { orderId, balanceAmount, estimatedDeliveryEnd } = unpaidOrders[safeIndex]
  const pendingAmount = parseFloat(balanceAmount)
  const daysLeft = estimatedDeliveryEnd ? daysUntil(estimatedDeliveryEnd) : null
  const remaining = unpaidOrders.length - 1 - safeIndex

  const cycleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setActiveIndex((i) => (i + 1) % unpaidOrders.length)
      setAnimating(false)
    }, 250)
  }

  return (
    <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-40 px-3 pb-2">
      {/*
        pb-5 gives 20px room below the main card so ghost cards can peek out.
        Ghost cards use positive z-index so they are real layers, not buried
        behind the page background like negative z-index would do.
      */}
      <div className="relative pb-5 mb-3">

        {/* Back ghost card (z-index 1) — peeks 20px below main card */}
        {remaining >= 2 && (
          <button
            onClick={cycleNext}
            className="absolute bottom-0 left-6 right-6 h-14 bg-[#F5B944]/55 rounded-2xl"
            style={{ zIndex: 1 }}
          />
        )}

        {/* Middle ghost card (z-index 2) — peeks 14px below main card */}
        {remaining >= 1 && (
          <button
            onClick={cycleNext}
            className="absolute bottom-[6px] left-3 right-3 h-14 bg-[#F5B944]/75 rounded-2xl"
            style={{ zIndex: 2 }}
          />
        )}

        {/* "Pay in X days" pill */}
        {daysLeft !== null && (
          <div
            className="absolute -top-3.5 right-4 bg-white border border-[#E5E7EB] rounded-full px-3 py-1 shadow-sm"
            style={{ zIndex: 4 }}
          >
            <span className="text-[12px] font-bold text-[#111827]">
              {daysLeft > 0 ? `Pay in ${daysLeft} day${daysLeft === 1 ? '' : 's'}` : 'Due today'}
            </span>
          </div>
        )}

        {/* Order counter pill */}
        {unpaidOrders.length > 1 && (
          <div
            className="absolute -top-3.5 left-4 bg-[#111827] rounded-full px-3 py-1 shadow-sm"
            style={{ zIndex: 4 }}
          >
            <span className="text-[12px] font-bold text-white">
              {safeIndex + 1} / {unpaidOrders.length}
            </span>
          </div>
        )}

        {/* Main card (z-index 3) — sits above ghost cards, covers their top portion */}
        <div
          className="relative transition-all duration-250"
          style={{
            zIndex: 3,
            transform: animating ? 'translateY(-6px) scale(0.97)' : 'translateY(0) scale(1)',
            opacity: animating ? 0 : 1,
            transition: 'transform 0.25s ease, opacity 0.25s ease',
          }}
        >
          <button
            onClick={() => router.push(`/order/${orderId}`)}
            className="w-full flex items-center gap-3 bg-[#F5B944] rounded-2xl px-4 py-4 shadow-lg"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
              <span className="text-[17px] font-black text-[#F59E0B] leading-none">i</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[15px] font-bold text-[#111827] leading-snug">Pay Remaining Amount</p>
              <p className="text-[12px] text-[#111827]/75 mt-0.5 leading-snug">
                <span className="font-bold text-[#111827]">{orderId}</span>
                {' · '}
                <span className="font-bold text-[#111827]">{formatINR(pendingAmount)}</span>
                {estimatedDeliveryEnd && (
                  <>{' '}by{' '}<span className="font-bold text-[#111827]">{formatDueDate(estimatedDeliveryEnd)}</span></>
                )}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#111827] shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}
