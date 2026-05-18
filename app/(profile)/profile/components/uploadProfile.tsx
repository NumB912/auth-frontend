"use client"
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { ValidateProfileInput, ValidateProfileSchema } from '@/app/_lib/validate/profilePut.validate'
import InputWithTooltip from '@/app/components/inputToolTip'
import { ProfileProps } from '../../interface/profile.interface'
import ClientAxios from '@/app/http/axios.http'
import { useRouter } from 'next/navigation'

interface UploadProfileProp{
    profile:ProfileProps,
    setIsOpen:(isOpen:boolean)=>void,
}

const UploadProfile = ({ profile,setIsOpen }: UploadProfileProp) => {
    const router = useRouter()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
    const { register, control, formState: { errors, isSubmitting }, handleSubmit, setError } = useForm<ValidateProfileInput>({
        resolver: zodResolver(ValidateProfileSchema),
        criteriaMode: "firstError",
        defaultValues: {
            firstName: profile?.firstName ?? '',
            lastName: profile?.lastName ?? '',
            sex: profile?.sex ?? 'other',
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null,
        }
    })

    const onSubmit = async (data: ValidateProfileInput) => {
        setSubmitError(null)
        setSubmitSuccess(false)
        try {
            await ClientAxios.getInstance().put('/user/profile/me', {
                firstName: data.firstName,
                lastName: data.lastName,
                sex: data.sex,
                dateOfBirth: data.dateOfBirth
            })

            setSubmitSuccess(true)
                router.refresh()
            await new Promise(rev=>setTimeout(rev,1500))
            setIsOpen(false)
        } catch (error: any) {
            const status = error?.response?.status
            const message = error?.response?.data?.message

            if (status === 400 && message) {
                if (Array.isArray(message)) {
                    message.forEach((msg: string) => {
                        if (msg.toLowerCase().includes("họ")) setError("firstName", { message: msg })
                        if (msg.toLowerCase().includes("tên")) setError("lastName", { message: msg })
                        if (msg.toLowerCase().includes("giới tính")) setError("sex", { message: msg })
                        if (msg.toLowerCase().includes("ngày sinh")) setError("dateOfBirth", { message: msg })
                    })
                } else {
                    setSubmitError(message)
                }
            } else if (status === 401) {
                setSubmitError("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại")
            } else if (status === 403) {
                setSubmitError("Bạn không có quyền thực hiện thao tác này")
            } else if (status === 500) {
                setSubmitError("Lỗi máy chủ, vui lòng thử lại sau")
            } else {
                setSubmitError("Có lỗi xảy ra, vui lòng thử lại")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="min-w-md flex flex-col gap-3 mt-5">
            <InputWithTooltip label="Họ người dùng" errorMessage={errors.firstName?.message}>
                <input
                    {...register('firstName')}
                    placeholder='Họ'
                    type='text'
                    className={`border rounded-md border-gray-500 p-2 w-full ${errors.firstName && "border-red-700"}`}
                />
            </InputWithTooltip>

            <InputWithTooltip label="Tên người dùng" errorMessage={errors.lastName?.message}>
                <input
                    {...register('lastName')}
                    placeholder='Tên'
                    type='text'
                    className={`border rounded-md border-gray-500 p-2 w-full ${errors.lastName && "border-red-700"}`}
                />
            </InputWithTooltip>

            <InputWithTooltip label="Giới tính" errorMessage={errors.sex?.message}>
                <select
                    {...register("sex")}
                    className="border rounded-md border-gray-500 p-2 w-full"
                >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                </select>
            </InputWithTooltip>

            <InputWithTooltip label="Ngày sinh" errorMessage={errors.dateOfBirth?.message}>
                <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="date"
                            value={field.value instanceof Date
                                ? field.value.toISOString().split('T')[0]
                                : field.value ?? ''
                            }
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                            className={`border rounded-md border-gray-500 p-2 w-full ${errors.dateOfBirth && "border-red-700"}`}
                        />
                    )}
                />
            </InputWithTooltip>

            {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {submitError}
                </div>
            )}

            {submitSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Cập nhật thông tin thành công
                </div>
            )}

            <button
                disabled={isSubmitting}
                type="submit"
                className={`bg-black text-white font-bold p-3 hover:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 ${isSubmitting && "bg-gray-500"}`}
            >
                Chỉnh sửa thông tin
                {isSubmitting && (
                    <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
            </button>
        </form>
    )
}

export default UploadProfile