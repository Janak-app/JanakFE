'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Info } from 'lucide-react'
import { DynamicMutationPayload } from '@/hooks/useMutationApi'
import useAddresses from '@/hooks/useAddresses'
import { SavedAddress } from '@/components/checkout/AddressForm'
import { AddressFormMode, AddressFormValues } from './AddressBottomSheet.types'

const schema = z.object({
  addressLine1: z.string().min(1, 'Required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  pincode: z.string().length(6, 'Enter valid pincode'),
  fullName: z.string().min(1, 'Required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
})

type AddressMutation = ReturnType<typeof useAddresses>['createMutation']

const toFormValues = (address: SavedAddress): AddressFormValues => ({
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2 ?? '',
  city: address.city,
  state: address.state,
  pincode: address.pincode,
  fullName: address.fullName,
  phone: address.phone,
})

interface AddressFormSheetProps {
  mode: AddressFormMode
  createMutation: AddressMutation
  updateMutation: AddressMutation
  onSaved: (address: SavedAddress) => void
  onCancel: () => void
}

const inputCls =
  'w-full h-12 bg-transparent px-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none'

export default function AddressFormSheet({
  mode,
  createMutation,
  updateMutation,
  onSaved,
  onCancel,
}: AddressFormSheetProps) {
  const isEdit = mode.type === 'edit'
  const mutation = isEdit ? updateMutation : createMutation

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: isEdit ? toFormValues(mode.address) : undefined,
  })

  useEffect(() => {
    if (isEdit) reset(toFormValues(mode.address))
  }, [isEdit, mode, reset])

  const onSubmit = (data: AddressFormValues) => {
    const payload: DynamicMutationPayload = isEdit
      ? { ...data, dynamicEndpointSuffix: mode.address.id }
      : { ...data, label: 'HOME', isDefault: false }

    mutation.mutate(payload, {
      onSuccess: (saved) => {
        onSaved(saved)
        reset()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-bold text-[#111827]">
          {isEdit ? 'Edit Address' : 'New Address'}
        </p>
        <button
          type="button"
          onClick={onCancel}
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
          <input
            {...register('phone')}
            placeholder="Contact Number*"
            inputMode="numeric"
            maxLength={10}
            className={inputCls}
          />
        </div>
        {errors.phone && (
          <p className="text-[11px] text-[#DC2626] mt-1 px-1">{errors.phone.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || mutation.isPending}
        className="w-full py-4 bg-accent text-white text-[15px] font-bold rounded-2xl disabled:opacity-50"
      >
        {mutation.isPending ? 'Saving…' : isEdit ? 'Update Address' : 'Save Address'}
      </button>
    </form>
  )
}
