"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { ValidateSignUpInput, ValidateSignUpSchema } from '@/app/_lib/validate/sign-up.validate'
import { FieldErrors, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import InputWithTooltip from '@/app/components/inputToolTip'
import InputPassword from '@/app/components/inputPassword'
import { useMutation } from '@tanstack/react-query'
import AxiosHttp from '@/app/http/axios.http'

const signUpHandle = async ({ token, password, confirmPassword, firstName, lastName }: { token: string, password: string, confirmPassword: string, firstName: string, lastName: string }) => {
    await new Promise((rel) => setTimeout(rel, 500))
    await AxiosHttp.getInstance().post('/auth/registerWithEmail',
        JSON.stringify({
            password: password,
            confirmPassword: confirmPassword,
            firstName: firstName,
            lastName: lastName
        }),
        {
            headers: {
                'X-Register-Token': token
            }
        },
    ).catch(err => {
        console.log(err)
        throw new Error(err.response?.data?.message ?? "Lỗi trong quá trình thực thi")
    })
}

const SignUpPage = ({ token, email }: { token: string, email: string }) => {
    const [error, setError] = useState<string>("")
    const route = useRouter()
    const { register, formState: { errors, isSubmitting }, handleSubmit, clearErrors, setError: setErrorReactForm, getValues } = useForm<ValidateSignUpInput>({
        resolver: zodResolver(ValidateSignUpSchema),
        criteriaMode: "firstError",
        mode: "onSubmit",
        defaultValues: {
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: ""
        }
    })

    const { mutateAsync } = useMutation({
        mutationFn: signUpHandle,
        onError: (error) => {
            setError(error.message)
        },
        onSuccess:()=>{
            setError("")
        }
    })

    const onError = (errors: FieldErrors<ValidateSignUpInput>) => {
        const firstError = Object.entries(errors)[0]
        if (firstError) {
            const [field, error] = firstError
            clearErrors()
            setErrorReactForm(field as unknown as keyof ValidateSignUpInput, { message: error.message })
        }
    }

    const onSubmit = async () => {
        try {
            const confirmPassword = getValues("confirmPassword")
            const password = getValues("password")
            const firstName = getValues("firstName")
            const lastName = getValues("lastName")
            await mutateAsync({
                confirmPassword: confirmPassword,
                password: password,
                lastName: lastName,
                firstName: firstName,
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
                    <p className='text-3xl font-bold text-center'>ĐĂNG KÝ</p>
                    <p className='text-sm font-thin text-center mt-3'>Bạn đang đăng ký với email <span className='underline'>{email}</span></p>
                </div>
                <hr className=' w-1/2 mt-3 border-gray-200' />
            </div>
            <div className='flex flex-col mt-3 gap-3 w-full justify-center items-center'>
                <form onSubmit={handleSubmit(onSubmit, onError)} className='flex flex-col gap-3 w-2/3'>
                    <div className='relative flex w-full gap-3'>
                        <InputWithTooltip errorMessage={errors.firstName?.message}>
                            <input {...register('firstName')} placeholder='Họ' type='text' className={`border rounded-md border-gray-500 p-2 w-full ${errors.firstName && "border-red-700"}`} />
                        </InputWithTooltip>

                        <InputWithTooltip errorMessage={errors.lastName?.message}>
                            <input {...register('lastName')} placeholder='Tên' type='text' className={`border rounded-md border-gray-500 p-2 w-full ${errors.lastName && "border-red-700"}`} />
                        </InputWithTooltip>
                    </div>
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
                        Đăng ký
                        {isSubmitting ? <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            : ""}
                    </button>
                </form>
            </div>
            <div className='flex justify-center items-center flex-col mt-3 gap-3'>
                <p><span className='font-light'>Bạn đã có tài khoản trước rồi?</span><Link href={'/sign-in'} className='hover:underline'>{' '}Đăng nhập</Link></p>
            </div>
        </>
    )
}

export default SignUpPage