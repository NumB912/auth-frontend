import React from 'react'

const Card = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='border border-gray-200 shadow-xl/5 max-w-3xl max-h-2xl bg-white w-full p-5'>{children}</div>
    )
}

export default Card