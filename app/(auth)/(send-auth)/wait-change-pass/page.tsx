
'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import logo from '@/app/public/photo/av.png'
import Image from 'next/image'
const Page = () => {
  const router = useRouter()
  useEffect(()=>{
    const redirect = setTimeout(()=>{
      router.replace('/sign-in')
    },5000)

    return ()=>{
      clearTimeout(redirect)
    }
  },[router])

  const handleRedirect = ()=>{
    router.replace('/sign-in')
  }

  return (
    <div>
      <div className='flex'>
        <button  className='rounded-full p-2 cursor-pointer hover:border-2 hover:border-black border-2 border-transparent' onClick={handleRedirect}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg></button>
      </div>
      <div className='w-full'>
        <div className='flex flex-col'>
          <div className='w-full mt-5 flex gap-3 items-center'>
            <Image src={logo} alt='' className="aspect-square w-full max-w-15 bg-black rounded-full p-2" />
            <p className='font-bold text-3xl'>WAITING...</p>
          </div>
          <p className='text-lg font-light mt-5'>We{'\''}ve sent link change password to your email.</p>
          <ol type='1' className='list-decimal list-inside mt-5'>
            <li>Open your email box (example@gmail.com)</li>
            <li>Click the link and you will be redirected to the change password page</li>
          </ol>

          <p className='mt-5'>The link will expired for 15 minutes, please check your mail to see</p>
        </div>
      </div>
    </div>
  )
}

export default Page
