'use client'
import React, { MouseEventHandler, useCallback, useRef } from 'react'

interface ModalProp {
    children: React.ReactNode,
    isOpen: boolean,
    label?: string,
    setIsOpen: (isOpen: boolean) => void
}

const Modal = ({ children, isOpen = true, setIsOpen, label }: ModalProp) => {
    const ref = useRef(null)
    const fun: MouseEventHandler = useCallback((e) => {
        if (e.target === ref.current) {
            setIsOpen(false)
        }
    }, [ref, setIsOpen])

    if (!isOpen) {
        return
    }

    return (
        <div ref={ref} className='fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60 p-10' onClick={fun}>
            <div className='absolute left-1/2 top-1/2 -translate-1/2 bg-white p-5 w-fit rounded-md'>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">{label}</p>
                    <button
                        onClick={() => setIsOpen(false)}
                        className='rounded-full cursor-pointer hover:border-2 hover:border-black border-2 border-transparent round-full p-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal