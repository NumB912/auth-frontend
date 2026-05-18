'use client'
import React from 'react'
import { ProfileProps } from '../../interface/profile.interface'
import WrapperField from '@/app/components/WrapperField'
import Image from 'next/image'
import DefaultImage from '@/app/public/photo/image.png'
import ClientAxios from '@/app/http/axios.http'
interface ProfileInfoDTO {
    profile: ProfileProps,
    setIsOpenUploadImage: (value: boolean) => void
    isOpenUploadImage: boolean,
    setIsOpenUploadProfile: (value: boolean) => void
    isOpenUploadProfile: boolean
}

const changeTypeSex = {
    male:"Nam",
    female:"Nữ",
    other:"Khác"
}

const ProfileInfo = ({ profile, setIsOpenUploadImage, isOpenUploadImage, setIsOpenUploadProfile, isOpenUploadProfile }: ProfileInfoDTO) => {
    const handleSignOut = async () => {
        await ClientAxios.getInstance().post('/auth/logout', {})
        window.location.href = '/sign-in'
    }
    return (
        <div className='flex flex-col gap-3'>
            <div className=' border border-gray-200 shadow-xl/5 max-h-2xl bg-white w-full p-5 rounded-md h-fit'>
                <div className='w-full flex flex-col items-center justify-center gap-3'>
                    <Image width={100} height={100} unoptimized className='aspect-square object-cover rounded-full border-2 p-1 hover:border-black hover:cursor-pointer border-dashed' src={profile?.avatar ? `${process.env.NEXT_PUBLIC_HOST}/photo/uploads/${profile.avatar}` : DefaultImage}
                        alt='avatar' onClick={() => {
                            setIsOpenUploadImage(!isOpenUploadImage)
                        }} />
                    <div>
                        <p className='text-xl font-bold text-center'>{profile?.firstName} {profile?.lastName}</p>
                        <p className='text-md font-light text-center text-gray-400'>{profile?.email}</p>
                    </div>
                 <button
                        onClick={handleSignOut}
                        className='group w-full mt-2 py-2 px-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-red-200 hover:shadow-md'
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5'
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Đăng xuất
                    </button>
                </div>

            </div>
            <div className='border border-gray-200 shadow-xl/5 max-h-2xl bg-white w-full p-5 rounded-md flex flex-col gap-3'>
                <p className='label text-lg font-bold'>
                    Tài khoản
                </p>
                <div className='content flex flex-col gap-3'>
                    <WrapperField>              
                        <div className='flex gap-3'>
                        <p className='text-md font-light'>
                            Email đã liên kết
                        </p>
                    </div>
                        <p className=''>
                            {profile?.email}
                        </p></WrapperField>
                </div>
            </div>


            <div className='border border-gray-200 shadow-xl/5 max-h-2xl bg-white w-full p-5 rounded-md flex flex-col gap-3'>
                <div className='flex justify-between'>

                    <p className='title text-lg font-bold'>
                        Thông tin cá nhân
                    </p>
    <button onClick={()=>{setIsOpenUploadProfile(!isOpenUploadProfile)}}
                        className='group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 active:scale-95 transition-all duration-200'
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className='w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-12'
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Chỉnh sửa
                    </button>
                </div>
                <div className='content grid grid-cols-2 gap-3'>
                    <WrapperField>
                        <div className='flex gap-3'>
                            <p className='text-md font-light'>
                                Tên người dùng
                            </p>
                        </div>
                        <p className=''>
                            {profile?.lastName}
                        </p>
                    </WrapperField>
                    <WrapperField>
                        <div className='flex gap-3'>
                            <p className='text-md font-light'>
                                Họ người dùng
                            </p>
                        </div>
                        <p className=''>
                            {profile?.firstName}
                        </p>
                    </WrapperField>

                    <WrapperField>
                        <div className='flex gap-3'>
                            <p className='text-md font-light'>
                                Giới tính người dùng
                            </p>
                        </div>
                        <p className=''>
                            {changeTypeSex[profile.sex]}
                        </p>
                    </WrapperField>

                    <WrapperField>
                        <div className='flex gap-3'>
                            <p className='text-md font-light'>
                                Ngày sinh
                            </p>
                        </div>
                        <p className=''>
                            {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toDateString() : "Chưa có thông tin"}
                        </p>
                    </WrapperField>
                </div>

            </div>
        </div>
    )
}

export default ProfileInfo