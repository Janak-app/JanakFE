'use client'

import useFetchApi from '@/hooks/useFetchApi'
import useMutationApi from '@/hooks/useMutationApi'
import { SavedAddress } from '@/components/checkout/AddressForm'

export default function useAddresses() {
  const {
    data: addresses,
    loading,
    retrieve: refetch,
  } = useFetchApi<SavedAddress[]>({
    endpoint: 'v1/addresses',
    cacheEnabled: false,
  })

  const createMutation = useMutationApi<SavedAddress>({
    method: 'post',
    endpoint: 'v1/addresses',
  })

  const updateMutation = useMutationApi<SavedAddress>({
    method: 'patch',
    endpoint: 'v1/addresses',
  })

  const deleteMutation = useMutationApi<SavedAddress>({
    method: 'delete',
    endpoint: 'v1/addresses',
  })

  return { addresses, loading, refetch, createMutation, updateMutation, deleteMutation }
}
