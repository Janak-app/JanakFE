'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  bottomSheetMinimumHeight?: number
  bottomSheetMaximumHeight?: number
  zIndexBackdrop?: number
  zIndexSheet?: number
  bgColor?: string
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  bottomSheetMaximumHeight,
  zIndexBackdrop = 40,
  zIndexSheet = 50,
  bgColor = '#ffffff',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const maxHeight = (typeof window !== 'undefined' && bottomSheetMaximumHeight) || 560

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const sheetContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#000]/70"
        style={{ zIndex: zIndexBackdrop }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 w-full shadow-xl transition-transform duration-300 ease-out rounded-t-3xl keyboard-persist"
        style={{
          height: `${maxHeight}px`,
          zIndex: zIndexSheet,
          WebkitTransform: 'translateZ(0)',
          backgroundColor: bgColor,
        }}
      >
        {/* Content */}
        <div className="h-full overflow-y-auto no-scrollbar pt-5">
          {children}
        </div>
      </div>
    </>
  )

  return createPortal(sheetContent, document.body)
}
