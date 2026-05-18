import React from 'react'

const layout =({ children }: {children: React.ReactNode }) => {
    return (
        <div className='border border-gray-200 shadow-xl/5 max-w-xl max-h-2xl bg-white p-5 rounded-2xl'>
            {children}
        </div>
    )
}

export default layout