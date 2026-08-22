'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Info, Plus, MapPin, Loader2 } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'
import useMutationApi, { DynamicMutationPayload } from '@/hooks/useMutationApi'
import useFetchApi from '@/hooks/useFetchApi'
import { SavedAddress } from '@/components/checkout/AddressForm'

interface AddressBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (address: SavedAddress) => void
  selectedId?: string
}

const schema = z.object({
  addressLine1: z.string().min(1, 'Required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  pincode: z.string().length(6, 'Enter valid pincode'),
  fullName: z.string().min(1, 'Required'),
  phone: z.string().min(10, 'Enter valid number').max(13),
})

type FormData = z.infer<typeof schema>

const inputCls =
  'w-full h-12 bg-transparent px-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none'

export default function AddressBottomSheet({
  isOpen,
  onClose,
  onSelect,
  selectedId,
}: AddressBottomSheetProps) {
  const [showForm, setShowForm] = useState(false)

  const { data: addresses, loading: addressesLoading, retrieve: refetchAddresses } =
    useFetchApi<SavedAddress[]>({
      endpoint: 'v1/addresses',
      cacheEnabled: false,
    })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const mutation = useMutationApi<SavedAddress>({
    method: 'post',
    endpoint: 'v1/addresses',
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate({ ...data, label: 'HOME', isDefault: false } as DynamicMutationPayload, {
      onSuccess: (saved) => {
        onSelect(saved)
        reset()
        setShowForm(false)
        onClose()
        refetchAddresses()
      },
    })
  }

  const handleSelect = (addr: SavedAddress) => {
    onSelect(addr)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} bottomSheetMaximumHeight={680}>
      <div className="flex flex-col px-4 pb-8 h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#111827]">Deliver to</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">

          {/* Saved addresses list */}
          {addressesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>
          ) : addresses && addresses.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold text-[#6B7280]">Saved Addresses</p>
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleSelect(addr)}
                  className={`w-full text-left flex items-start gap-3 border rounded-xl p-3 transition-colors ${
                    selectedId === addr.id
                      ? 'border-accent bg-[#EFF6FF]'
                      : 'border-[#E5E7EB] bg-white'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    selectedId === addr.id ? 'border-accent' : 'border-[#D1D5DB]'
                  }`}>
                    {selectedId === addr.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="text-[12px] font-bold text-accent uppercase tracking-wide">
                        {addr.label}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#111827]">{addr.fullName}</p>
                    <p className="text-[12px] text-[#6B7280] leading-snug mt-0.5">
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ''},{' '}
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">{addr.phone}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {/* Add new address toggle */}
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-[14px] font-semibold text-accent py-2"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-[#111827]">New Address</p>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); reset() }}
                  className="text-[12px] text-[#6B7280] font-medium"
                >
                  Cancel
                </button>
              </div>

              {/* Info banner */}
              <div className="flex items-start gap-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-3">
                <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#92400E] leading-snug">
                  Ensure your address details are accurate for a smooth delivery experience
                </p>
              </div>

              {/* Delivery Address */}
              <div>
                <p className="text-[13px] font-bold text-[#111827] mb-2">Delivery Address</p>
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#E5E7EB]">
                  <input {...register('addressLine1')} placeholder="Building / House Name*" className={inputCls} />
                  <input {...register('addressLine2')} placeholder="Street, Area, Block / Colony*" className={inputCls} />
                  <input {...register('city')} placeholder="City*" className={inputCls} />
                  <input {...register('state')} placeholder="State*" className={inputCls} />
                  <input {...register('pincode')} placeholder="Pin code*" inputMode="numeric" maxLength={6} className={inputCls} />
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <p className="text-[13px] font-bold text-[#111827] mb-2">Contact Details</p>
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#E5E7EB]">
                  <input {...register('fullName')} placeholder="Customer Name*" className={inputCls} />
                  <input {...register('phone')} placeholder="Contact Number*" inputMode="tel" className={inputCls} />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || mutation.isPending}
                className="w-full py-4 bg-accent text-white text-[15px] font-bold rounded-2xl disabled:opacity-50"
              >
                {mutation.isPending ? 'Saving…' : 'Save Address'}
              </button>
            </form>
          )}
        </div>
      </div>
    </BottomSheet>
  )
}
