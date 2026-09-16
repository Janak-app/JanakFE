import { SavedAddress } from '@/components/checkout/AddressForm'

export interface AddressBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (address: SavedAddress) => void
  selectedId?: string
}

export type AddressFormMode =
  | { type: 'add' }
  | { type: 'edit'; address: SavedAddress }

export interface AddressFormValues {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  fullName: string
  phone: string
}
