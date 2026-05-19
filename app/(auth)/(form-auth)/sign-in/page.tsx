"use client"
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { validateSignInSchema, ValidateSignInInput } from '@/app/_lib/validate/login.validate'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import InputAndToolTip from '@/app/components/inputToolTip'
import InputPassword from '@/app/components/inputPassword'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import AxiosHttp from '@/app/http/axios.http'
import { useRouter } from 'next/navigation'
import Label from '@/app/components/label'

const loginHandle = async ({ email, password }: { email: string, password: string }) => {
  await new Promise((rel) => setTimeout(rel, 500))
  await AxiosHttp.getInstance().post<{ token: string }>('/auth/loginWithEmail',
    JSON.stringify({
      email: email,
      password: password
    }),
    {
      withCredentials: true,
      headers: {
        'Content-type': 'application/json'
      }
    }).catch((error) => {
      if (error?.message == 'EMAIL_OR_PASSWORD_INCORRECT') {
        throw new Error('Lỗi không đúng tài khoản hoặc mật khẩu')
      }

      if(error.message=='NOT FOUND EMAIL OR NOT MATCH PASSWORD'){
         throw Error('Lỗi không đúng tài khoản hoặc mật khẩu')
      }
      throw new Error(error.message ?? "Lỗi trong quá trình thực thi")
    })
}

const Page = () => {
  const router = useRouter()
  const { mutateAsync } = useMutation({
    mutationFn: loginHandle,
    onSuccess: () => {
      setError("")
      router.replace('/profile/me')
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const [error, setError] = useState<string>("")
  const [isSuccess,setIsSuccess] = useState<boolean>(false)
  const { register, formState: { errors, isSubmitting }, handleSubmit, setError: setErrorForm, clearErrors, getValues } = useForm<ValidateSignInInput>({
    resolver: zodResolver(validateSignInSchema),
    criteriaMode: "firstError",
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onError = (errors: FieldErrors<ValidateSignInInput>) => {
    const firstError = Object.entries(errors)[0]
    if (firstError) {
      const [field, error] = firstError
      clearErrors()
      setErrorForm(field as unknown as keyof ValidateSignInInput, { message: error.message })
    }
  }

  const onSubmit: SubmitHandler<ValidateSignInInput> = async (data) => {
    try {
      await mutateAsync({ email: data.email, password: data.password })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>

      <div className='flex flex-col justify-center items-center w-full'>
        <div className='w-3/4'>
          <p className='text-3xl font-bold text-center'>ĐĂNG NHẬP</p>
          <p className='text-sm font-thin text-center mt-2'>Bạn chuẩn bị để đăng nhập chưa?</p>
        </div>
        <button className='bg-white border border-gray-500 w-2/3 rounded-full mt-3 p-2 hover:scale-[0.98] transition  cursor-pointer'>Đăng nhập với google</button>
        <hr className=' w-1/2 mt-3 border-gray-200' />
      </div>
      <div className='flex flex-col mt-3 gap-3 w-full justify-center items-center'>
        <form onSubmit={
          handleSubmit(onSubmit, onError)
        } className='flex flex-col gap-3 w-2/3'>

          <InputAndToolTip errorMessage={errors.email?.message}>
            <input
              {...register("email")}
              type={"email"}
              placeholder={"Email"}
              className={`border border-gray-500 p-2 w-full rounded-md ${errors.email ? "border-red-500" : ""
                }`}
            />
          </InputAndToolTip>

          <div>
            <InputPassword register={register('password')} placeholder='Mật khẩu' className='border rounded-md border-gray-500 p-2 w-full' />
            {errors.password ? <p className='rounded-md text-xs text-red-700 shadow-xl whitespace-nowrap z-10'>{errors.password.message}</p> : ""}
          </div>

          {error && <Label variant='failed' size='sm'>{error}</Label>}
          <button disabled={isSubmitting} className={`bg-black text-white font-bold p-3 hover:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 ${isSubmitting && "bg-gray-500"}`}>
            Đăng nhập
            {isSubmitting ? <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              : ""}
          </button>
        </form>
      </div>

      <div className='flex justify-center items-center flex-col mt-3 gap-3'>
        <Link href={'/send-change-pass'} className=' hover:underline'>Quên mật khẩu?</Link>
        <p><span className='font-light'>Bạn không có mật khẩu?</span><Link href={'/send-sign-up'} className='hover:underline'>{' '}Đăng ký</Link></p>
      </div>
    </>
  )
}

export default Page