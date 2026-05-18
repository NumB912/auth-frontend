import React from 'react'
const layout = (
    { children }
        : { children: React.ReactNode }) => {
    return (
        <html>
            <body>
                <div className='flex justify-center items-center bg-gray-100 h-screen'>
                    {children}
                </div>
            </body>
        </html>
    )
}

export default layout