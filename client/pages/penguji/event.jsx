import React from 'react'
import Link from 'next/link'
import Header from './components/header'

const event = () => {
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
                        
                        {/* card event */}
                        <Link href={'/penguji/detail_event'}>
                            <div className="hover:scale-105 transition ease-in-out duration-500 hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                <div className="bg-navy shadow drop-shadow-lg rounded-md p-5 text-center">
                                    <h1 className='text-xl font-semibold text-green tracking-wide'>UKT Jambon</h1>
                                    <h1 className='text-white tracking-wider'>117 Siswa</h1>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default event