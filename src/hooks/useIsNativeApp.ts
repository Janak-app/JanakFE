'use client'

import { useSyncExternalStore } from 'react'
import { Capacitor } from '@capacitor/core'

const subscribe = () => () => {}

export default function useIsNativeApp() {
  return useSyncExternalStore(
    subscribe,
    () => Capacitor.isNativePlatform(),
    () => false
  )
}
