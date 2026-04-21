import React from 'react'
import Sidebar from './components/sidebar'
import Header from './components/header'
import Footer from './components/footer'
import { useRouter } from 'next/router'
import Link from 'next/link'

const index = () => {

    // deklarasi router
    const router = useRouter()

    const CardPenguji = ({ tipeUkt, name }) => {
        return (
            <Link href={`/pengurus/ukt/${tipeUkt}`} >
                <div
                    className="hover:scale-105 transition ease-in-out duration-500 hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5  mt-4">
                    <div className="bg-navy shadow drop-shadow-lg rounded-md p-5 text-center">
                        <h1 className='text-xl font-semibold text-green tracking-wide'>{name}</h1>
                    </div>
                </div>
            </Link>
        )
    }

    const dataTipeUkt = [
        {
            tipe: 'ukt_jambon',
            name: 'UKT Jambon'
        },
        {
            tipe: 'ukt_hijau',
            name: 'UKT Hijau'
        },
        {
            tipe: 'ukt_putih',
            name: 'UKT Putih'
        },
        {
            tipe: 'ukcw',
            name: 'UKCW'
        }
    ]
    return (
        <div className="flex font-lato">

            {/* awal wrapper konten utama */}
            {/* supaya konten header dapat di scroll dan tidak mempengaruhi sidebar */}
            <div className="w-full h-screen">

                {/* overlap untuk device sm */}
                {/* <div className="absolute hidden lg:hidden inset-0 bg-slate-400 opacity-50 z-10">
                </div> */}

                {/* header */}
                <Header />
                {/* akhir header */}

                {/* konten utama */}
                <div className="min-h-full bg-darkBlue p-6">

                    {/* wrapper page name and download data */}
                    <div className="flex justify-between items-center text-white mb-7">

                        {/* page name */}
                        <h1 className='text-2xl tracking-wider'>Dashboard</h1>
                    </div>

                    {/* wrapper ukt card */}
                    <div className="border-t-2 border-white px-3">
                        {
                            dataTipeUkt.map((item, index) => (
                                <CardPenguji key={index} tipeUkt={item.tipe} name={item.name} />
                            ))
                        }
                    </div>
                </div>
                {/* akhir konten utama */}

                {/* footer */}
                <Footer />
                {/* akhir footer */}

            </div>
            {/* akhir wrapper konten utama */}
        </div>
    )
}

export default index