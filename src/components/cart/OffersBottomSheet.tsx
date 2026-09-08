'use client'

import { useState } from 'react'
import { X, BadgePercent, Tag, Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'
import BottomSheet from '@/components/ui/BottomSheet'
import useMutationApi from '@/hooks/useMutationApi'
import useFetchApi from '@/hooks/useFetchApi'
import { formatINR } from '@/data/products'

interface Coupon {
  code: string
  discountType: 'flat' | 'percent'
  discountValue: string | null
  discountPercent: string | null
  maxDiscountAmount: string | null
  minimumOrderValue: string | null
  isPublic: boolean
  expiresAt: string | null
  freeProduct: string | null
}

function getSavingsLabel(coupon: Coupon): string {
  if (coupon.discountType === 'flat' && coupon.discountValue) {
    return `Save ${formatINR(parseFloat(coupon.discountValue))}`
  }
  if (coupon.discountType === 'percent' && coupon.discountPercent) {
    const pct = coupon.discountPercent
    return coupon.maxDiscountAmount
      ? `${pct}% off (up to ${formatINR(parseFloat(coupon.maxDiscountAmount))})`
      : `${pct}% off`
  }
  return ''
}

function getDescription(coupon: Coupon): string {
  const parts: string[] = []
  if (coupon.minimumOrderValue) {
    parts.push(`Min. order ${formatINR(parseFloat(coupon.minimumOrderValue))}`)
  }
  if (coupon.expiresAt) {
    const date = new Date(coupon.expiresAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
    parts.push(`Valid till ${date}`)
  }
  return parts.join(' · ')
}

interface OffersBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply: (code: string) => void
}

export default function OffersBottomSheet({ isOpen, onClose, onApply }: OffersBottomSheetProps) {
  const [coupon, setCoupon] = useState('')
  const [pendingCode, setPendingCode] = useState<string | null>(null)
  const [inputError, setInputError] = useState<string | null>(null)

  const { data: coupons, loading: couponsLoading } = useFetchApi<Coupon[]>({
    endpoint: 'v1/coupons',
    cacheEnabled: false,
  })

  const mutation = useMutationApi<unknown, { code: string }>({
    method: 'post',
    endpoint: 'v1/coupons/validate',
    errorOff: true,
  })

  const validateAndApply = (code: string) => {
    setCoupon(code)
    setPendingCode(code)
    setInputError(null)
    mutation.mutate({ code }, {
      onSuccess: () => {
        onApply(code)
        setCoupon('')
        setPendingCode(null)
        onClose()
      },
      onError: (err) => {
        setPendingCode(null)
        const msg = (err as AxiosError<{ message?: string }>)?.response?.data?.message
        setInputError(msg || 'Invalid coupon code')
      },
    })
  }

  const handleManualApply = () => {
    const trimmed = coupon.trim().toUpperCase()
    if (!trimmed) return
    validateAndApply(trimmed)
  }

  const isManualPending = mutation.isPending && pendingCode === coupon.trim().toUpperCase()

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} bottomSheetMaximumHeight={560}>
      <div className="flex flex-col px-4 pb-8 h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold text-[#111827]">Coupons &amp; Offers</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Coupon input */}
        <div className="mb-6">
          <div className={`flex items-center gap-2 border rounded-xl px-3 ${inputError ? 'border-[#DC2626]' : 'border-[#E5E7EB]'}`}>
            <Tag className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            <input
              type="text"
              value={coupon}
              onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setInputError(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleManualApply()}
              placeholder="Enter coupon code"
              className="flex-1 h-12 bg-transparent text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none tracking-wider"
            />
            <button
              type="button"
              onClick={handleManualApply}
              disabled={!coupon.trim() || mutation.isPending}
              className="text-[13px] font-bold text-accent disabled:text-[#9CA3AF] shrink-0 py-2 flex items-center gap-1"
            >
              {isManualPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
            </button>
          </div>
          {inputError && (
            <p className="text-[12px] font-medium text-[#DC2626] mt-1.5 px-1">{inputError}</p>
          )}
        </div>

        {/* Available offers */}
        <p className="text-[13px] font-semibold text-[#6B7280] mb-3">Available Offers</p>
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
          {couponsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>
          ) : coupons && coupons.length > 0 ? (
            coupons.map((item) => {
              const savings = getSavingsLabel(item)
              const description = getDescription(item)
              return (
                <div
                  key={item.code}
                  className="flex items-start gap-3 border border-[#E5E7EB] rounded-xl p-3"
                >
                  <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                    <BadgePercent className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[13px] font-bold text-[#111827] tracking-wide">
                        {item.code}
                      </span>
                      {savings && (
                        <span className="text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded-full">
                          {savings}
                        </span>
                      )}
                    </div>
                    {description && (
                      <p className="text-[12px] text-[#6B7280]">{description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => validateAndApply(item.code)}
                    disabled={mutation.isPending}
                    className="text-[13px] font-bold text-accent disabled:text-[#9CA3AF] shrink-0 py-1 flex items-center gap-1"
                  >
                    {pendingCode === item.code
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : 'Apply'}
                  </button>
                </div>
              )
            })
          ) : (
            <p className="text-[13px] text-[#9CA3AF] text-center py-6">No offers available</p>
          )}
        </div>
      </div>
    </BottomSheet>
  )
}
