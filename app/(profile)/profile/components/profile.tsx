'use client'
import React, { useState } from 'react'
import Modal from '@/app/components/modal'
import UploadImage from '../components/uploadImage'
import UploadProfile from '../components/uploadProfile'
import { ProfileProps } from '../../interface/profile.interface'
import ProfileInfo from '../components/profileInfo'

const Profile = ({profile}:{profile:ProfileProps}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isOpenUploadImage, setIsOpenUploadImage] = useState<boolean>(false)

  return (
    <div className=' gap-3 max-w-3xl h-full w-full my-10'>
      <ProfileInfo profile={profile} isOpenUploadImage={isOpenUploadImage} setIsOpenUploadImage={setIsOpenUploadImage} isOpenUploadProfile={isOpen} setIsOpenUploadProfile={setIsOpen}/>

      <Modal label='Chỉnh sửa thông tin' isOpen={isOpen} setIsOpen={setIsOpen}>
        <UploadProfile profile={profile} setIsOpen={setIsOpen}/>
      </Modal>

      <Modal label='Chỉnh sửa thông tin' isOpen={isOpenUploadImage} setIsOpen={setIsOpenUploadImage}>
        <UploadImage setIsOpen={setIsOpenUploadImage} isOpen={isOpenUploadImage} avatar={profile?.avatar ? `${process.env.NEXT_PUBLIC_HOST}/photo/uploads/${profile.avatar}` : ''} />
      </Modal>
    </div>
  )
}

export default Profile