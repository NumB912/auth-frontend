
'use client'
import { validateOTPSchema } from '@/app/_lib/validate/confirm-otp.validate'
import AxiosHttp from '@/app/http/axios.http'
import logo from '@/app/public/photo/av.png'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
const ConfirmOtp = async ({ email, otp }: { email: string, otp: string }): Promise<{
  token: string, message: string
}> => {

  await new Promise((rsl) => setTimeout(rsl, 500))

  const res = await AxiosHttp.getInstance().post<{ token: string, message: string }>('/auth/confirm-otp', JSON.stringify({
    email: email,
    otp: otp,
  })).catch(error => {
    if (error?.message === 'OTP_ERROR') {
      throw new Error("OTP không đúng vui lòng thử lại")
    }

    if (error?.message === 'OTP_EXPRIRED') {
      throw new Error("OTP đã hết hạn vui lòng gửi, otp khác")
    }

    if (error?.message === 'OTP_MAX_ATTEMPTS') {
      throw new Error("Đã hết số lần có thể xác nhận OTP vui lòng thử lại")
    }

    throw new Error(error?.message ?? "Lỗi trong quá trình xác thực otp vui lòng thử lại")
  })

  return {
    token: res.token,
    message: res.message
  }
}


const SendOtpHandle = async ({ email }: { email: string }): Promise<void> => {
  await new Promise((rsl) => setTimeout(rsl, 500))
  const res = await fetch('http://localhost:3000/api/v1/auth/send-otp', {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
    })
  }).catch(error=>{
  
    console.log(error)
    if (error?.response?.data.message == 'WAIT_30_SECONDS') {
      throw new Error('Email đã được gửi vui lòng chờ 30 giây để thử lại')
    }
    throw new Error(error?.response?.data.message ?? 'Gửi OTP thất bại')
  })

}

const Page = () => {
  const { email } = useParams()
  const decodeEmail = decodeURIComponent(email as string)
  const refs = useRef<HTMLInputElement[]>([])
  const dataRef = useRef<HTMLFormElement>(null)
  const route = useRouter()
  const [isResendOTP, setIsResendOTP] = useState<boolean>(false)
  const [countTime, setCountTime] = useState<number>(30)
  const [error, setError] = useState<string>("")
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ConfirmOtp,
    onSuccess: () => {
      setError("")
    },
    onError: (error) => {
      refs.current.forEach((box) => {
        box.value = ''
      })

      refs.current[0].focus()
      setError(error.message)
    }
  })

  const { isPending: isPendingResend, mutateAsync: mutateResend } = useMutation({
    mutationFn: SendOtpHandle,
    onSuccess: () => {
      setIsResendOTP(false)
      setCountTime(30)
    },
  })

  useEffect(() => {
    if (countTime === 0) {
      return
    }
    const timer = setTimeout(() => {
      if (countTime == 1) {
        setIsResendOTP(true)
      }
      setCountTime((prev) => prev - 1)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [countTime])

  const copyHandle = (e: ClipboardEvent) => {
    const value = e.clipboardData?.getData('text/plain');

    if (!value || value.trim() === '') return;

    let index = 0;
    value.split("").forEach((digit) => {
      if (/[0-9]/.test(digit) && index < refs.current.length) {
        refs.current[index].value = digit;
        index++;
      }
    });

    const lastFocus = Math.min(index, refs.current.length - 1);
    refs.current[lastFocus].focus();
  };


  useEffect(() => {
    addEventListener('paste', copyHandle)
    return () => {
      removeEventListener('paste', copyHandle)
    }
  }, [])

  const resend = async () => {
    try {
      await mutateResend({
        email: decodeEmail
      })
    } catch (error) {
      console.error("Lỗi trong quá trình thực thi")
    }

  }

  const handelKey = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      dataRef.current?.requestSubmit()
      return
    }

    const value = e.currentTarget.value
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault()
      return
    }
    if (value && index < refs.current.length - 1) {
      refs.current[index + 1]?.focus()
    }
    if (!value && e.key === "Backspace" && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handleConfirmOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (!dataRef.current || !check()) {
        setError("Otp không được trống phải là 6 ký tự")
        throw Error("Otp không được trống phải là 6 ký tự")
      }
      const data = new FormData(dataRef.current)
      const otp = Array.from(data.values()).join("")
      const validate = validateOTPSchema.safeParse({ otp })
      if (validate.error) {
        const firstError = validate.error.issues[0].message
        setError(firstError)
        throw new Error(firstError)
      }
      const sendOtp = await mutateAsync({ email: decodeEmail, otp: otp })
      route.push(`/sign-up/${sendOtp.token}`)
    } catch (error) {
      console.error('Lỗi trong quá trình thực hiện', error)
    }
  }

  const check = (): boolean => {
    return refs.current.every((ref) => ref.value !== '')
  }

  return (
    <div>
      <div className='flex'>
        <button className='rounded-full p-2 cursor-pointer hover:border-2 hover:border-black border-2 border-transparent'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg></button>
      </div>
      <div className='w-full max-w-md'>
        <div className='flex flex-col'>
          <div className='w-full mt-5 flex gap-3 items-center'>
            <Image src={logo} alt='' className="aspect-square w-full max-w-15 bg-black rounded-full p-2" />
            <p className='font-bold text-3xl'>XÁC THỰC OTP</p>
          </div>
          <p className='text-lg font-light mt-5'>Chúng tôi sẽ gửi mã OTP thông qua email của bạn <span className='underline'>({`${decodeEmail}`})</span></p>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <form onSubmit={handleConfirmOtp} ref={dataRef} className='mt-5 w-2xs'>
            <div className='flex gap-2 w-full'>
              {
                Array.from({ length: 6 }).map((_, index) =>
                  <input key={index} ref={(el) => { if (el) refs.current[index] = el }} onKeyDown={(e) => {
                    handelKey(e, index)
                  }} type="text" maxLength={1} name={`input-${index}`} className='w-full border border-gray-500 rounded text-center p-2 aspect-square text-2xl' />
                )
              }
            </div>
            {error && <p className='text-xs text-red-700 mt-3'>{error}</p>}
            <button disabled={isPending} type='submit' className={`bg-black text-white font-bold p-3 hover:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 w-full mt-3 ${isPending && "bg-gray-500"}`}>
              Xác nhận
              {isPending ? <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} ></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                : ""}
            </button>
          </form>

          <button onClick={() => {
            resend()
          }}
            disabled={!isResendOTP || isPendingResend}
            className={`
            max-w-2xs w-full 
            mt-3 p-2
            border font-bold 
            hover:scale-[0.98] transition cursor-pointer
            flex items-center justify-center gap-2
            ${!isResendOTP ? 'bg-gray-300 text-white' : ""}
              `}>
            {!isResendOTP ? `Đợi để gửi lại trong (${countTime})` : 'Yêu cầu gửi lại'}
            {isPendingResend ? <svg className="size-5 animate-spin text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              : ""}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page