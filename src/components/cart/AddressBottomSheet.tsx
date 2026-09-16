'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'
import useAddresses from '@/hooks/useAddresses'
import { SavedAddress } from '@/components/checkout/AddressForm'
import AddressListItem from './AddressListItem'
import AddressFormSheet from './AddressFormSheet'
import { AddressBottomSheetProps, AddressFormMode } from './AddressBottomSheet.types'

export default function AddressBottomSheet({
  isOpen,
  onClose,
  onSelect,
  selectedId,
}: AddressBottomSheetProps) {
  const [formMode, setFormMode] = useState<AddressFormMode | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const {
    addresses,
    loading: addressesLoading,
    refetch: refetchAddresses,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useAddresses()

  const handleSelect = (addr: SavedAddress) => {
    onSelect(addr)
    onClose()
  }

  const handleSaved = (address: SavedAddress) => {
    onSelect(address)
    setFormMode(null)
    onClose()
    refetchAddresses()
  }

  const handleDelete = (address: SavedAddress) => {
    setDeletingId(address.id)
    deleteMutation.mutate(
      { dynamicEndpointSuffix: address.id },
      {
        onSuccess: () => {
          setDeletingId(null)
          refetchAddresses()
        },
        onError: () => setDeletingId(null),
      }
    )
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
                <AddressListItem
                  key={addr.id}
                  address={addr}
                  selected={selectedId === addr.id}
                  deleting={deletingId === addr.id}
                  onSelect={handleSelect}
                  onEdit={(a) => setFormMode({ type: 'edit', address: a })}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : null}

          {/* Add new address toggle / form */}
          {!formMode ? (
            <button
              type="button"
              onClick={() => setFormMode({ type: 'add' })}
              className="flex items-center gap-2 text-[14px] font-semibold text-accent py-2"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          ) : (
            <AddressFormSheet
              mode={formMode}
              createMutation={createMutation}
              updateMutation={updateMutation}
              onSaved={handleSaved}
              onCancel={() => setFormMode(null)}
            />
          )}
        </div>
      </div>
    </BottomSheet>
  )
}
