'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatINR } from '@/data/products'
import useFetchApi from '@/hooks/useFetchApi'

type PendingBalance = {
  orderId: string
  pendingAmount: number
  dueDate: string
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

  const { data } = useFetchApi<PendingBalance[]>({
    endpoint: 'v1/orders/pending-balance',
    cacheEnabled: false,
  })

  if (!data?.length) return null

  const { orderId, pendingAmount, dueDate } = data[0]
  if (pendingAmount == null || !dueDate) return null
  const daysLeft = daysUntil(dueDate)

  return (
    <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-40 px-3 pb-2">
      <div className="relative mb-3">

        {/* Ghost cards for stack effect — rendered first so they sit behind */}
        {data.length > 2 && (
          <div className="absolute bottom-[-10px] left-4 right-4 h-14 bg-[#F5B944]/60 rounded-2xl -z-10" />
        )}
        {data.length > 1 && (
          <div className="absolute bottom-[-5px] left-2 right-2 h-14 bg-[#F5B944]/80 rounded-2xl -z-10" />
        )}

        {/* "Pay in X days" pill */}
        <div className="absolute -top-3.5 right-4 bg-white border border-[#E5E7EB] rounded-full px-3 py-1 shadow-sm z-10">
          <span className="text-[12px] font-bold text-[#111827]">
            {daysLeft > 0 ? `Pay in ${daysLeft} day${daysLeft === 1 ? '' : 's'}` : 'Due today'}
          </span>
        </div>

        {/* Main card */}
        <button
          onClick={() => router.push(`/checkout?orderId=${orderId}`)}
          className="relative z-10 w-full flex items-center gap-3 bg-[#F5B944] rounded-2xl px-4 py-4 shadow-lg"
        >
          {/* Info icon box */}
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
            <span className="text-[17px] font-black text-[#F59E0B] leading-none">i</span>
          </div>

          {/* Text */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-[15px] font-bold text-[#111827] leading-snug">Pay Remaining Amount</p>
            <p className="text-[12px] text-[#111827]/75 mt-0.5 leading-snug">
              Remaining Amount{' '}
              <span className="font-bold text-[#111827]">{formatINR(pendingAmount)}</span>
              {' '}by{' '}
              <span className="font-bold text-[#111827]">{formatDueDate(dueDate)}</span>
            </p>
          </div>

          {/* Chevron */}
          <ChevronRight className="w-5 h-5 text-[#111827] shrink-0" />
        </button>
      </div>
    </div>
  )
}
