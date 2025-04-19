import React from 'react'
import Header from './components/header'
import Link from 'next/link'

const detail_event = () => {
    return (
        <>
            <div className="font-lato">

                {/* awal wrapper konten utama */}
                <div className="w-full h-screen">

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-10 py-8">
                        
                        {/* wrapper category */}
                        <div className="flex bg-navy gap-x-2 overflow-x-scroll text-purple mb-3">
                            <div className="bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md">Senam</div>
                            <div className="bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md">Jurus</div>
                            <div className="bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md">Fisik</div>
                            <div className="bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md">Teknik</div>
                            <div className="bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md">Sambung</div>
                        </div>

                        {/* search */}
                        <div className="bg-white py-1.5 px-4 rounded-md gap-x-2 flex items-center mb-5 ">
                            <svg width="25" height="25" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.3746 18.3751L14.5684 14.5688" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            
                            {/* input search */}
                            <input className='w-full p-1.5 focus:outline-none' placeholder='Search' type="text" />

                            {/* filter button */}
                            <button>
                                <svg width="25" height="25" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M25.6667 3.5H2.33337L11.6667 14.5367V22.1667L16.3334 24.5V14.5367L25.6667 3.5Z" stroke="#6464F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* card siswa information */}
                        <Link href={'./senam'}>
                            <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                <h1 className='text-green tracking-wide text-lg'>0800113784</h1>
                                <h1 className='text-xl font-semibold'>Nadia  Azza Destination Wkwk</h1>
                                <h1 className='tracking-wide'>Trenggalek</h1>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>    
    )
}

export default detail_event