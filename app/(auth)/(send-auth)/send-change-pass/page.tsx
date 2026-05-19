
'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import logo from '@/app/public/photo/av.png'
import Image from 'next/image'
import InputAndToolTip from '@/app/components/inputToolTip'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ValidateChangePassInput, validateChangePassSchema } from '@/app/_lib/validate/send-change-pass.validate'
import { useMutation } from '@tanstack/react-query'
import AxiosHttp from '@/app/http/axios.http'
import Label from '@/app/components/label'

const HandleSendChangePass = async ({ email }: { email: string }) => {
   await AxiosHttp.getInstance().post('/auth/send-change-pass',
    JSON.stringify({
      email: email,
    }),
  ).catch(error=>{
    throw Error(error.message ?? "Lỗi trong quá trình thực thi")
  })


}

const Page = () => {
  const [error, setError] = useState<string>("")
  const { mutateAsync } = useMutation({
    mutationFn: HandleSendChangePass,
    onSuccess:()=>{
      setError("")
    },
    onError:(error)=>{
      setError(error.message)
    }
  })
  const route = useRouter()
  const { register, formState: { errors, isSubmitting }, handleSubmit, getValues } = useForm<ValidateChangePassInput>({
    resolver: zodResolver(validateChangePassSchema),
    criteriaMode: "firstError",
    mode: "onSubmit",
    defaultValues: {
      email: "",
    }
  })
  const onSubmit = async () => {
    try {
      const email = getValues("email")
      await mutateAsync({ email })
      route.push(`/wait-change-pass`)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      }
    }
  }

  return (
    <div>
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
            <p className='font-bold text-3xl'>Quên mật khẩu hả?</p>
          </div>
          <p className='text-lg font-light mt-5'>Không sao. Chỉ cần nhập email của bạn vào dưới đấy, Chúng tôi sẽ gửi cho bạn đường liên kết để đổi mật khẩu qua email bạn (Nhớ Check nha).</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='mt-5 w-2xs'>
          <InputAndToolTip errorMessage={errors.email?.message}>
            <input
              {...register("email")}
              type={"email"}
              placeholder={"Email"}
              className={`border border-gray-500 p-2 w-full rounded-md ${errors.email ? "border-red-500" : ""
                }`}
            />
          </InputAndToolTip>
          {error&&<Label variant='failed'>{error}</Label>}
          <button disabled={isSubmitting} className={`bg-black text-white font-bold p-3 hover:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 w-full mt-3 ${isSubmitting && "bg-gray-500"}`}>
            Xác nhận
            {isSubmitting ? <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              : ""}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page
