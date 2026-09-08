'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, Loader2 } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'
import useMutationApi, { DynamicMutationPayload } from '@/hooks/useMutationApi'

const schema = z.object({
  companyName: z.string().min(1, 'Required'),
  phone: z.string().length(10, 'Enter valid 10-digit number'),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter valid PAN (e.g. ABCDE1234F)'),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
      'Enter valid 15-digit GSTIN'
    ),
})

type FormData = z.infer<typeof schema>

export interface GstDetails {
  companyName: string
  phone: string
  panNumber: string
  gstin: string
  panCardFile: File
  gstCertificateFile: File
}

interface GstBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (details: GstDetails) => void
}

const inputCls =
  'w-full h-12 bg-transparent px-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none'

export default function GstBottomSheet({ isOpen, onClose, onSuccess }: GstBottomSheetProps) {
  const [panCardFile, setpanCardFile] = useState<File | null>(null)
  const [gstCertFile, setGstCertFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const mutation = useMutationApi({
    method: 'post',
    endpoint: 'v1/company-profile',
  })

  const handleClose = () => {
    reset()
    setpanCardFile(null)
    setGstCertFile(null)
    onClose()
  }

  const allFilesSelected = !!panCardFile && !!gstCertFile
  const canSubmit = isValid && allFilesSelected && !mutation.isPending

  const onFormSubmit = (data: FormData) => {
    if (!panCardFile || !gstCertFile) return

    const fd = new FormData()
    fd.append('companyName', data.companyName)
    fd.append('phone', data.phone)
    fd.append('panNumber', data.panNumber)
    fd.append('gstin', data.gstin)
    fd.append('panCardFile', panCardFile)
    fd.append('gstCertificateFile', gstCertFile)

    mutation.mutate(fd as unknown as DynamicMutationPayload, {
      onSuccess: () => {
        onSuccess({ ...data, panCardFile, gstCertificateFile: gstCertFile })
        handleClose()
      },
    })
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} bottomSheetMaximumHeight={680}>
      <div className="flex flex-col px-4 pb-8 h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold text-[#111827]">GST Details</h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">

            {/* Company & Contact */}
            <div>
              <p className="text-[13px] font-bold text-[#111827] mb-2">Company Details</p>
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#E5E7EB]">
                <input
                  {...register('companyName')}
                  placeholder="Company Name*"
                  className={inputCls}
                />
                <input
                  {...register('phone')}
                  placeholder="Phone Number*"
                  inputMode="tel"
                  maxLength={10}
                  className={inputCls}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-[#DC2626] mt-1 px-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Tax Details */}
            <div>
              <p className="text-[13px] font-bold text-[#111827] mb-2">Tax Details</p>
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#E5E7EB]">
                <input
                  {...register('panNumber')}
                  placeholder="PAN Number* (e.g. ABCDE1234F)"
                  className={`${inputCls} uppercase`}
                  maxLength={10}
                />
                <input
                  {...register('gstin')}
                  placeholder="GSTIN* (15 characters)"
                  className={`${inputCls} uppercase`}
                  maxLength={15}
                />
              </div>
              {errors.panNumber && (
                <p className="text-[11px] text-[#DC2626] mt-1 px-1">{errors.panNumber.message}</p>
              )}
              {errors.gstin && (
                <p className="text-[11px] text-[#DC2626] mt-1 px-1">{errors.gstin.message}</p>
              )}
            </div>

            {/* File Uploads */}
            <div>
              <p className="text-[13px] font-bold text-[#111827] mb-2">Documents</p>
              <div className="flex flex-col gap-3">
                <FileUploadField
                  label="PAN Card*"
                  file={panCardFile}
                  onChange={setpanCardFile}
                  accept="image/*,.pdf"
                />
                <FileUploadField
                  label="GST Certificate*"
                  file={gstCertFile}
                  onChange={setGstCertFile}
                  accept="image/*,.pdf"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-4 bg-accent text-white text-[15px] font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save GST Details'
              )}
            </button>
          </form>
        </div>
      </div>
    </BottomSheet>
  )
}

function FileUploadField({
  label,
  file,
  onChange,
  accept,
}: {
  label: string
  file: File | null
  onChange: (file: File) => void
  accept?: string
}) {
  return (
    <label className="flex items-center gap-3 border border-dashed border-[#D1D5DB] rounded-xl px-4 py-3 cursor-pointer active:bg-[#F9FAFB]">
      <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
        <Upload className="w-4 h-4 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#111827]">{label}</p>
        {file ? (
          <p className="text-[12px] text-[#16A34A] truncate">{file.name}</p>
        ) : (
          <p className="text-[12px] text-[#9CA3AF]">Tap to upload (JPG, PNG, PDF)</p>
        )}
      </div>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onChange(f)
        }}
      />
    </label>
  )
}
