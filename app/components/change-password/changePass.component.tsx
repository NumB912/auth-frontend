"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldErrors, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import InputPassword from '@/app/components/inputPassword'
import { useMutation } from '@tanstack/react-query'
import { ValidateChangePasswordInput, ValidateChangePasswordSchema } from '@/app/_lib/validate/change-pass.validate'
import AxiosHttp from '@/app/http/axios.http'

const changePasswordHandle = async ({ token, password, confirmPassword }: { token: string, password: string, confirmPassword: string }) => {
    await new Promise((rel) => setTimeout(rel, 500))
    await AxiosHttp.getInstance().post('/auth/change-password',
        JSON.stringify({
            password: password,
            confirmPassword: confirmPassword,
        }),
        {
            headers: {
                'X-Change-Password-Token': token
            }
        },
    ).catch(err => {
        throw new Error(err.response?.data?.message ?? "Lỗi trong quá trình thực thi")
    })

}

const ChangePasswordPage = ({ token, email }: { token: string, email: string }) => {
    const [error, setError] = useState<string>("")
    const route = useRouter()
    const { register, formState: { errors, isSubmitting }, handleSubmit, clearErrors, setError: setErrorReactForm, getValues } = useForm<ValidateChangePasswordInput>({
        resolver: zodResolver(ValidateChangePasswordSchema),
        criteriaMode: "firstError",
        mode: "onSubmit",
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    })

    const { mutateAsync } = useMutation({
        mutationFn: changePasswordHandle,
        onError: (error) => {
            setError(error.message)
        }
    })

    const onError = (errors: FieldErrors<ValidateChangePasswordInput>) => {
        const firstError = Object.entries(errors)[0]
        if (firstError) {
            const [field, error] = firstError
            clearErrors()
            setErrorReactForm(field as unknown as keyof ValidateChangePasswordInput, { message: error.message })
        }
    }

    const onSubmit = async () => {
        try {
            const confirmPassword = getValues("confirmPassword")
            const password = getValues("password")
            await mutateAsync({
                confirmPassword: confirmPassword,
                password: password,
                token: token
            })
            route.replace('/sign-in')
        } catch (error) {
            console.error('Lỗi trong quá trình thực hiện', error)
        }
    }

    return (
        <>
            <div className='flex flex-col justify-center items-center w-full'>
                <div className='w-3/4'>
                    <p className='text-3xl font-bold text-center'>ĐỔI MẬT KHẨU</p>
                    <p className='text-sm font-thin text-center mt-3'>Bạn đang đổi mật khẩu với email <span className='underline'>{email}</span></p>
                </div>
                <hr className=' w-1/2 mt-3 border-gray-200' />
            </div>
            <div className='flex flex-col mt-3 gap-3 w-full justify-center items-center'>
                <form onSubmit={handleSubmit(onSubmit, onError)} className='flex flex-col gap-3 w-2/3'>
                    <div>
                        <InputPassword register={register('password')} placeholder='Mật khẩu' className='border rounded-md border-gray-500 p-2 w-full' />
                        {errors.password ? <p className='rounded-md text-xs text-red-700 shadow-xl whitespace-nowrap z-10'>{errors.password.message}</p> : ""}
                    </div>


                    <div>
                        <InputPassword register={register('confirmPassword')} placeholder='Xác nhận mật khẩu' className='border rounded-md border-gray-500 p-2 w-full' />
                        {errors.confirmPassword ? <p className='rounded-md text-xs text-red-700 shadow-xl whitespace-nowrap z-10'>{errors.confirmPassword.message}</p> : ""}
                    </div>

                    {error && <p className='text-xs text-red-700 mt-3'>{error}</p>}

                    <button disabled={isSubmitting} type="submit" className={`bg-black text-white font-bold p-3 hover:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 ${isSubmitting && "bg-gray-500"}`}>
                        Đổi mật khẩu
                        {isSubmitting ? <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            : ""}
                    </button>
                </form>
            </div>
            <div className='flex justify-center items-center flex-col mt-3 gap-3'>
                <p><span className='font-light'>Đổi ý rồi không đổi nữa?</span><Link href={'/sign-in'} className='hover:underline'>{' '}Đăng nhập</Link></p>
            </div>
        </>
    )
}

export default ChangePasswordPage