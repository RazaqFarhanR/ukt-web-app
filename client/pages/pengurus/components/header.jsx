import React, { useContext, useState } from 'react'
import { globalState } from '@/context/context'
import Link from 'next/link'

const header = () => {

    const {showSideBar, setShowSideBar} = useContext (globalState)

    const openSideBar = () => {
        setShowSideBar (!showSideBar)
    }

    return (
        <>
            <div className="sticky top-0 z-10 header border-b bg-black w-full px-2 py-3 font-lato">
                <div className="flex justify-between items-center px-4">
                    {/* button sidebar */}
                    <button className="text-slate-600 text-2xl w-10 h-10 hidden lg:block" onClick={() => openSideBar()}>
                        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M1 7H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M1 13H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    {/* Title */}
                    <h1 className='text-white font-semibold text-xl'>PSHT Cabang Trenggalek</h1>
                    <Link href={'/admin/edit_profile'} className="">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25 26.25V23.75C25 22.4239 24.4732 21.1521 23.5355 20.2145C22.5979 19.2768 21.3261 18.75 20 18.75H10C8.67392 18.75 7.40215 19.2768 6.46447 20.2145C5.52678 21.1521 5 22.4239 5 23.75V26.25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 13.75C17.7614 13.75 20 11.5114 20 8.75C20 5.98858 17.7614 3.75 15 3.75C12.2386 3.75 10 5.98858 10 8.75C10 11.5114 12.2386 13.75 15 13.75Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default header