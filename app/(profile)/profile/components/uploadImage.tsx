'use client'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import logo from '@/app/public/photo/image.png'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import ClientAxios from '@/app/http/axios.http'

const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  await ClientAxios.getInstance().post('user/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

interface UploadImageProp{
  avatar:string,
  setIsOpen:(isOpen:boolean)=>void
  isOpen:boolean
}

const UploadImage = ({ avatar,isOpen,setIsOpen}: UploadImageProp) => {
  const [preview, setPreview] = useState<string | null>(avatar)
  const [file, setFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      setErrorMsg(null)
      setIsOpen(false)
      router.refresh()
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Upload thất bại, vui lòng thử lại!'
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg)
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    const maxSize = 10 * 1024 * 1024
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']

    if (selected.size > maxSize) {
      setErrorMsg('File quá lớn! Chỉ chấp nhận file dưới 10MB.')
      return
    }

    if (!allowedTypes.includes(selected.type)) {
      setErrorMsg('Chỉ chấp nhận file: jpg, jpeg, png, gif.')
      return
    }

    setErrorMsg(null)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return
    setErrorMsg(null)
    mutate(file)
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-md flex flex-col gap-3 mt-5">
      <Image
        className='max-w-50 w-full aspect-square object-cover rounded-full self-center hover:border-2 p-1 hover:cursor-pointer border-dashed border-black'
        src={preview ?? logo}
        alt='avatar'
        unoptimized
        width={160}
        height={160}
        onClick={() => inputRef.current?.click()}
      />

      <div className='mt-5'>
        <p className="text-sm italic">Bạn chỉ có thể gửi hình ảnh từ 10MB trở xuống thôi!!</p>
        <p className="text-sm italic">và còn nữa bạn có thể gửi các tệp như sau nha: (jpg, png, gif, jpeg)</p>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={inputRef}
      />

      {/* 👇 hiển thị lỗi */}
      {errorMsg && (
        <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md'>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-.75 5.75a.75.75 0 011.5 0v5a.75.75 0 01-1.5 0v-5zm.75 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !file}
        className='bg-black text-white font-bold p-3 hover:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed'
      >
        {isPending
          ? <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          : 'Xác nhận'
        }
      </button>
    </form>
  )
}

export default UploadImage