import Profile from '../components/profile'
import serverFetch from '@/app/http/fetch.http'

const Page = async () => {
  const profile = await serverFetch(`/user/profile/me`, {
    method:"GET",
    cache: 'no-store',
  }).then((res)=>res.result)
  return (
    <div className='w-full h-full justify-center flex'>
      <Profile profile={profile} />
    </div>
  )
}

export default Page