'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Info } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'
import useMutationApi, { DynamicMutationPayload } from '@/hooks/useMutationApi'
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
}: AddressBottomSheetProps) {
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
        onClose()
      },
    })
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} bottomSheetMaximumHeight={680}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-4 pb-8 h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#111827]">Deliver to</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-3 mb-5">
          <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#92400E] leading-snug">
            Ensure your address details are accurate for a smooth delivery experience
          </p>
        </div>

        {/* Scrollable fields */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5">

          {/* Delivery Address */}
          <div>
            <p className="text-[15px] font-bold text-[#111827] mb-3">Delivery Address</p>
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#E5E7EB]">
              <input
                {...register('addressLine1')}
                placeholder="Building / House Name*"
                className={inputCls}
              />
              <input
                {...register('addressLine2')}
                placeholder="Street, Area, Block / Colony*"
                className={inputCls}
              />
              <input
                {...register('city')}
                placeholder="City*"
                className={inputCls}
              />
              <input
                {...register('state')}
                placeholder="State*"
                className={inputCls}
              />
              <input
                {...register('pincode')}
                placeholder="Pin code*"
                inputMode="numeric"
                maxLength={6}
                className={inputCls}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <p className="text-[15px] font-bold text-[#111827] mb-3">Contact Details</p>
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#E5E7EB]">
              <input
                {...register('fullName')}
                placeholder="Customer Name*"
                className={inputCls}
              />
              <input
                {...register('phone')}
                placeholder="Contact Number*"
                inputMode="tel"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={!isValid || mutation.isPending}
          className="w-full mt-5 py-4 bg-accent text-white text-[15px] font-bold rounded-2xl disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving…' : 'Save Address'}
        </button>
      </form>
    </BottomSheet>
  )
}
