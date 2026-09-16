'use client'

import { useState } from 'react'
import { MapPin, Pencil, Trash2, Loader2 } from 'lucide-react'
import { SavedAddress } from '@/components/checkout/AddressForm'

interface AddressListItemProps {
  address: SavedAddress
  selected: boolean
  deleting: boolean
  onSelect: (address: SavedAddress) => void
  onEdit: (address: SavedAddress) => void
  onDelete: (address: SavedAddress) => void
}

export default function AddressListItem({
  address,
  selected,
  deleting,
  onSelect,
  onEdit,
  onDelete,
}: AddressListItemProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div
      className={`w-full border rounded-xl p-3 transition-colors ${
        selected ? 'border-accent bg-[#EFF6FF]' : 'border-[#E5E7EB] bg-white'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(address)}
        className="w-full text-left flex items-start gap-3"
      >
        <div
          className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
            selected ? 'border-accent' : 'border-[#D1D5DB]'
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-[12px] font-bold text-accent uppercase tracking-wide">
              {address.label}
            </span>
          </div>
          <p className="text-[13px] font-semibold text-[#111827]">{address.fullName}</p>
          <p className="text-[12px] text-[#6B7280] leading-snug mt-0.5">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ''},{' '}
            {address.city}, {address.state} — {address.pincode}
          </p>
          <p className="text-[12px] text-[#6B7280] mt-0.5">{address.phone}</p>
        </div>
      </button>

      {confirmingDelete ? (
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#E5E7EB]">
          <span className="text-[12px] text-[#6B7280] mr-auto">Remove this address?</span>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="text-[12px] font-semibold text-[#6B7280]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onDelete(address)}
            disabled={deleting}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#DC2626] disabled:opacity-50"
          >
            {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-4 mt-2 pt-2 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#374151]"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#DC2626]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
