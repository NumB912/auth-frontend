import Image from 'next/image'
import React from 'react'
import image from '@/app/public/photo/image.png'
import logo from '@/app/public/photo/logo.png'
const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex max-w-5xl max-h-2xl justify-between w-full p-5'>
            <div className='left-side w-full p-6 border border-gray-200 shadow-xl bg-white'>
                <div className='flex justify-between items-center w-full'>

                    <div>
                        <p className='text-3xl font-bold italic'>AOI HOZUKI</p>
                        <p className='text-sm font-thin'>Let{'\''}s gho-!!!</p>
                    </div>

                    <div className='w-full max-w-50 flex justify-center'>
                        <Image
                            alt='Logo'
                            src={logo}
                            className='w-full object-cover rounded-tr-2xl rounded-br-2xl'
                        />
                    </div>
                </div>
                <div className='w-full justify-center items-center mt-20'>   {children}</div>

            </div>
            <div className='right-side max-w-xl w-3/4'>
                <Image
                    alt='Logo'
                    src={image}
                    className='w-full h-full object-cover rounded-tr-2xl rounded-br-2xl'
                />
            </div>
        </div>
    )
}

export default layout