'use client'

import { useState } from 'react'
import { X, Copy, Check, Building2, QrCode } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'

// ── Update these with your actual payment details ──────────────────────────
const BANK_DETAILS = {
  accountName: 'Janak GNSS Pvt. Ltd.',
  accountNumber: '1234567890',
  ifsc: 'HDFC0001234',
  bankName: 'HDFC Bank',
  branch: 'Ahmedabad Main Branch',
}
const UPI_ID = 'janakgnss@hdfcbank'
const QR_IMAGE_PATH = '/images/payment-qr.png'
// ──────────────────────────────────────────────────────────────────────────

type Tab = 'qr' | 'bank'

interface Props {
  isOpen: boolean
  onClose: () => void
  balanceAmount: string
  orderId: string
}

export default function PayBalanceBottomSheet({ isOpen, onClose, balanceAmount, orderId }: Props) {
  const [tab, setTab] = useState<Tab>('qr')

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} bottomSheetMaximumHeight={560}>
      <div className="flex flex-col h-full px-4 pb-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[16px] font-bold text-[#111827]">Pay Remaining Balance</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Order + amount chip */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[12px] text-[#6B7280]">{orderId}</span>
          <span className="bg-[#FEF3C7] text-[#92400E] text-[13px] font-bold px-3 py-1 rounded-full">
            {balanceAmount} due
          </span>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-[#E5E7EB] mb-4 shrink-0">
          <button
            onClick={() => setTab('qr')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold transition-colors ${
              tab === 'qr' ? 'bg-accent text-white' : 'bg-white text-[#6B7280]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Scan QR / UPI
          </button>
          <button
            onClick={() => setTab('bank')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold transition-colors ${
              tab === 'bank' ? 'bg-accent text-white' : 'bg-white text-[#6B7280]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Bank Transfer
          </button>
        </div>

        {/* QR Tab */}
        {tab === 'qr' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-52 h-52 rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_IMAGE_PATH}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <p className="hidden text-[12px] text-[#9CA3AF] text-center px-4">
                QR image not available
              </p>
            </div>

            <CopyRow label="UPI ID" value={UPI_ID} />

            <p className="text-[12px] text-[#6B7280] text-center leading-relaxed">
              Scan the QR using any UPI app and pay{' '}
              <span className="font-bold text-[#111827]">{balanceAmount}</span>.{' '}
              After payment, share the UTR/reference number with us.
            </p>
          </div>
        )}

        {/* Bank Transfer Tab */}
        {tab === 'bank' && (
          <div className="flex flex-col gap-3">
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <BankRow label="Account Name" value={BANK_DETAILS.accountName} />
              <BankRow label="Account Number" value={BANK_DETAILS.accountNumber} copyable />
              <BankRow label="IFSC Code" value={BANK_DETAILS.ifsc} copyable />
              <BankRow label="Bank" value={BANK_DETAILS.bankName} />
              <BankRow label="Branch" value={BANK_DETAILS.branch} last />
            </div>

            <div className="bg-[#FEF3C7] rounded-xl px-4 py-3">
              <p className="text-[12px] text-[#92400E] leading-relaxed">
                Transfer{' '}
                <span className="font-bold">{balanceAmount}</span>{' '}
                via NEFT/RTGS and share the reference number with your sales representative.
              </p>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl px-4 py-3 w-full">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#9CA3AF]">{label}</p>
        <p className="text-[14px] font-semibold text-[#111827] truncate">{value}</p>
      </div>
      <button
        onClick={copy}
        className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0"
      >
        {copied ? (
          <Check className="w-4 h-4 text-[#16A34A]" />
        ) : (
          <Copy className="w-4 h-4 text-[#6B7280]" />
        )}
      </button>
    </div>
  )
}

function BankRow({
  label,
  value,
  copyable = false,
  last = false,
}: {
  label: string
  value: string
  copyable?: boolean
  last?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        !last ? 'border-b border-[#E5E7EB]' : ''
      }`}
    >
      <div>
        <p className="text-[11px] text-[#9CA3AF]">{label}</p>
        <p className="text-[13px] font-semibold text-[#111827]">{value}</p>
      </div>
      {copyable && (
        <button
          onClick={copy}
          className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#16A34A]" />
          ) : (
            <Copy className="w-4 h-4 text-[#6B7280]" />
          )}
        </button>
      )}
    </div>
  )
}
