import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '../../../components/sidebar'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import { useRouter } from 'next/router'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const PaketUkcw = () => {

    // deklarasi router
    const router = useRouter ()

    //state 
    const [ukcw,setUkcw] = useState(0)
    const [jambon,setJambon] = useState(0)
    const [hijau,setHijau] = useState(0)
    const [putih,setPutih] = useState(0)

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem ('token') === null || localStorage.getItem ('admin') === null) {
            router.push ('/admin/login')
        }
    }

    const headerConfig = () =>{
        const token = localStorage.getItem("token")
        let header = {
            headers: {Authorization: `Bearer ${token}`}
        }
        return header
    }

    const getJumlah = async () => {
        console.log(BASE_URL + 'soal/count');
        await axios.get(BASE_URL + 'soal/count', headerConfig())
        .then(res => {
            setJambon(res.data.jambon || 0)
            setHijau(res.data.hijau || 0)
            setPutih(res.data.putih || 0)
            setUkcw(res.data.ukcw || 0)
        })
        .catch(err => {
            console.log(err.message);
            console.log(err.response.data.message);
        })
    }

    const dataPaket = [
        {
            paket: 1
        },
        {
            paket: 2
        },
        {
            paket: 3
        },
    ]

    useEffect (() => {
        isLogged ()
        getJumlah()
    }, [])

    return (
        <>
        <div className="flex font-lato">

            {/* sidebar */}
            <Sidebar />
            {/* akhir sidebar */}

            {/* awal wrapper konten utama */}
            {/* supaya konten header dapat di scroll dan tidak mempengaruhi sidebar */}
            <div className="w-full overflow-y-auto min-h-screen h-auto flex flex-col">

                {/* overlap untuk device sm */}
                {/* <div className="absolute hidden lg:hidden inset-0 bg-slate-400 opacity-50 z-10">
                </div> */}

                {/* header */}
                <Header />
                {/* akhir header */}

                {/* konten utama */}
                <div className="h-full bg-darkBlue p-6">

                    {/* wrapper page name and search */}
                    <div className="flex justify-between items-center text-white mb-7">

                        {/* page name */}
                        <h1 className='text-2xl tracking-wider uppercase font-bold'>Materi - KESHAN - UKCW</h1>

                        {/* search */}
                        {/* <div className="bg-purple rounded-md px-5 py-2 flex items-center gap-x-2 w-72">
                            <svg className='z-50' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input className='bg-transparent placeholder:text-white placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none' placeholder='Search' type="text" />
                        </div> */}
                    </div>

                    {/* data count */}
                    <div className="flex flex-wrap justify-center gap-5 my-5">
                        {dataPaket.map((item, index)=>(
                            <button key={index+1} onClick={() => router.push(`./ukcw/${item.paket}`)} className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md w-[32%]">
                                {/* inner bg */}
                                <div className="bg-navy p-5 rounded-md">

                                    {/* ranting name */}
                                    <h1 className='text-green text-center text-2xl '>Paket {item.paket}</h1>

                                </div>
                            </button>

                        ))}
                    </div>

                </div>
                {/* akhir konten utama */}

                {/* footer */}
                <Footer/>
                {/* akhir footer */}

            </div>
            {/* akhir wrapper konten utama */}
        </div>  
    </>

    )
}

export default PaketUkcw