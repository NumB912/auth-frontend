
'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import logo from '@/app/public/photo/av.png'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { ValidateEmailInput, validateEmailSchema } from '@/app/_lib/validate/send-otp.validate'
import { zodResolver } from '@hookform/resolvers/zod'
import InputAndToolTip from '@/app/components/inputToolTip'
import { useMutation } from '@tanstack/react-query'
import AxiosHttp from '@/app/http/axios.http'

const SendOtpHandle = async (email: string) => {
  await new Promise((rev) => setTimeout(rev, 500))

  await AxiosHttp.getInstance().post('/auth/send-otp',
    JSON.stringify({
      email: email,
    })
    , {
      headers: {
        'Content-type': 'application/json'
      }
    }
  ).catch((error) => {
    if (error?.message == 'EMAIL_IS_USED') {
      throw new Error('Email đã tồn tại vui lòng dùng email khác, hoặc đăng nhập')
    }
    if (error?.message == 'WAIT_30_SECONDS') {
      throw new Error('Email đã được gửi vui lòng chờ 30 giây để thử lại')
    }

    throw new Error(error?.message ?? 'Gửi OTP thất bại')
  })

}

const Page = () => {
  const router = useRouter()
  const [error, setError] = useState<string>("")

  const { isPending, mutate, isError } = useMutation({
    mutationFn: SendOtpHandle,
    onSuccess: () => {
      const email = getValues("email")
      setError("")
      router.push(`/otp-confirm/${encodeURIComponent(email)}`)
    },
    onError: (error) => {
      setError(error.message)
    }
  })
  const { register, formState: { errors }, handleSubmit, getValues } = useForm<ValidateEmailInput>({
    criteriaMode: 'firstError',
    resolver: zodResolver(validateEmailSchema)
  })

  const onSubmit = async ({ email }: ValidateEmailInput) => {
    setError("")
    mutate(email)
  }

  return (
    <>
      <div className='flex'>
        <button className='rounded-full p-2 cursor-pointer hover:border-2 hover:border-black border-2 border-transparent'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg></button>
      </div>
      <div className='w-full'>
        <div className='flex flex-col'>
          <div className='w-full mt-5 flex gap-3 items-center'>
            <Image src={logo} alt='' className="aspect-square w-full max-w-15 bg-black rounded-full p-2" />
            <p className='font-bold text-3xl'>Yêu cầu đăng ký</p>
          </div>
          <p className='text-lg font-light mt-5'>Bạn chỉ cần nhập dòng email phía dưới, sau đó chúng tôi sẽ gửi OTP để có thể đăng ký nhé.</p>
        </div>

        <form className='mt-5 w-2xs' onSubmit={handleSubmit(onSubmit)}>
          <InputAndToolTip errorMessage={errors.email?.message}>
            <input
              {...register("email")}
              type={"email"}
              placeholder={"Email"}
              className={`border border-gray-500 p-2 w-full rounded-md ${errors.email ? "border-red-500" : ""
                }`}
            />
          </InputAndToolTip>
          {isError ? <p className='text-xs text-red-700 mt-3'>{error}</p> : ""}

          <button disabled={isPending} className={`bg-black text-white font-bold p-3 hover:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 w-full mt-3 ${isPending && "bg-gray-500"}`}>
            Xác nhận
            {isPending ? <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              : ""}
          </button>
        </form>
      </div>
    </>
  )
}

export default Page