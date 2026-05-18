import ChangePasswordPage from '@/app/components/change-password/changePass.component'
import { verifyToken } from '@/app/utils/verify.utils'
import { redirect } from 'next/navigation'

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
    const { token } = await params
    let email = ''
    try {
        const payload = await verifyToken(token)
        email = payload.email
    } catch (error) {
        console.error(error)
        redirect('/sign-in')
    }
    return <ChangePasswordPage email={email} token={token} />
}

export default Page