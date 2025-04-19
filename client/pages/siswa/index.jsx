import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const index = () => {
    const router = useRouter()
    return (
        <>
            <div className="font-lato">

                {/* awal wrapper konten utama */}
                <div className="w-full h-screen">

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-10 py-20 flex flex-col">
                        <div className="text-white flex flex-col items-center text-center">

                            {/* psht icon */}
                            <img className='w-32 mb-4' src="/images/psht-icon.png" alt="" />

                            {/* title */}
                            <h1 className='text-xl font-semibold mb-12 tracking-wider'>
                                UJI KENAIKAN TINGKAT<br/>
                                PERSAUDARAAN SETIA HATI TERATE<br/>
                                CABANG TRENGGALEK<br/>
                            </h1>

                        </div>
                        <div className='flex justify-between mx-10'>
                            <button 
                                className='bg-[#1B2537] w-[20%] py-24 rounded-xl active:bg-[#192334]' 
                                onClick={() => router.push("/siswa/ukt jambon")}
                            >
                                <h1 className='text-[#42C6A3] text-2xl text-center font-bold tracking-wider'>UKT JAMBON</h1>
                            </button>
                            <button 
                                className='bg-[#1B2537] w-[20%] py-24 rounded-xl active:bg-[#192334]'
                                onClick={() => router.push("/siswa/ukt hijau")}
                            >
                                <h1 className='text-[#42C6A3] text-2xl text-center font-bold tracking-wider'>UKT HIJAU</h1>
                            </button>
                            <button 
                                className='bg-[#1B2537] w-[20%] py-24 rounded-xl active:bg-[#192334]'
                                onClick={() => router.push("/siswa/ukt putih")}
                            >
                                <h1 className='text-[#42C6A3] text-2xl text-center font-bold tracking-wider'>UKT PUTIH</h1>
                            </button>
                            <button 
                                className='bg-[#1B2537] w-[20%] py-24 rounded-xl active:bg-[#192334]'
                                onClick={() => router.push("/siswa/ukcw")}
                            >
                                <h1 className='text-[#42C6A3] text-2xl text-center font-bold tracking-wider'>UKCW</h1>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default index