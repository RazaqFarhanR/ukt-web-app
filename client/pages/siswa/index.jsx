import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const index = () => {
    const router = useRouter()

    const tipeUkt = [
        {
            name: "UKT JAMBON",
            link: "/siswa/ukt jambon",
            fill: "bg-[#FF32DE]"
        },
        {
            name: "UKT HIJAU",
            link: "/siswa/ukt hijau",
            fill: "bg-[#0B8800]"
        },
        {
            name: "UKT PUTIH",
            link: "/siswa/ukt putih",
            fill: "bg-[#FFFFFF]"
        },
        {
            name: "UKCW",
            link: "/siswa/ukcw",
            fill: 'bg-[#2D3844]'
        }
    ]

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
                                UJI KENAIKAN TINGKAT<br />
                                PERSAUDARAAN SETIA HATI TERATE<br />
                                CABANG TRENGGALEK<br />
                            </h1>

                        </div>
                        <div className='flex flex-col md:flex-row justify-between mx-10'>
                            {tipeUkt.map(item => (
                                <button
                                    className={`${item.fill} w-full md:w-[20%] py-12 md:py-24 my-2 rounded-xl active:bg-[#192334]`}
                                    onClick={() => router.push(item.link)}
                                >
                                    <h1 className={`text-navy text-2xl text-center font-bold tracking-wider`}>{item.name}</h1>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default index