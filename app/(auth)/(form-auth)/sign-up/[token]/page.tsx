// app/sign-up/[token]/page.tsx
import SignUpPage from '@/app/components/sign-up/signUpForm.component'
import { verifyToken } from '@/app/utils/verify.utils'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    let email = ''
    try {
        console.log(token)
        const payload = await verifyToken(token)
        email = payload.email
    } catch (error) {
        console.error(error)
        redirect('/sign-in')
    }

    return <SignUpPage email={email} token={token} />
}