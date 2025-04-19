import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Footer from '../../components/footer'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ukt_jambon = () => {

    // deklarasi router
    const router = useRouter ()

    // state
    const [dataEvent, setDataEvent] = useState ([])

    // function get data event
    const getDataEvent = () => {
        const token = localStorage.getItem ('token')

        axios.get (BASE_URL + `event/ukt/UKT Jambon`, { headers: { Authorization: `Bearer ${token}`}})
        .then (res => {
            setDataEvent (res.data.data)
        })
        .catch (err => {
            console.log(err.message);
        })
    }

    // function modal add
    const addModal = () => {
        setShowModalEvent (true)
        setAction ('insert')
        setName ('')
        setDate ('')
        setTipe ('UKT Jambon')
    }

    // function to rekap nilai
    const toRekapNilai = (item) => {
        localStorage.setItem ('event', JSON.stringify (item))
        router.push ('./rekap_nilai_ukt_jambon')
    }

    // function to detail nilai
    const toDetailNilai = (item) => {
        localStorage.setItem ('event', JSON.stringify (item))
        router.push ('./detail_nilai_ukt_jambon')
    }

    useEffect (() => {
        getDataEvent ()
    }, [])

    return (
        <>
            <div className="flex font-lato">

                {/* sidebar */}
                <Sidebar />
                {/* akhir sidebar */}

                {/* awal wrapper konten utama */}
                {/* supaya konten header dapat di scroll dan tidak mempengaruhi sidebar */}
                <div className="w-full overflow-y-auto h-screen">

                    {/* overlap untuk device sm */}
                    {/* <div className="absolute hidden lg:hidden inset-0 bg-slate-400 opacity-50 z-10">
                    </div> */}

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue p-6">

                        {/* wrapper page name and search */}
                        <div className="flex justify-between items-center text-white mb-7">

                            {/* page name */}
                            <h1 className='text-2xl tracking-wider'>UKT - UKT Jambon</h1>

                            {/* search and button add data */}
                            <div className="flex gap-x-3">
                                <div className="bg-purple rounded-md px-5 py-2 flex items-center gap-x-2 w-72">
                                    <svg className='z-50' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input className='bg-transparent placeholder:text-white placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none' placeholder='Search' type="text" />
                                </div>
                            </div>

                        </div>

                        {/* wrapper card event */}
                        <div className="grid grid-cols-2 gap-x-5">
                            
                            {/* card event */}
                            {dataEvent.map((item, index) => (
                                <div key={index + 1} className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">

                                    {/* inner bg */}
                                    <div className="bg-navy p-5 rounded-md space-y-3 flex flex-col justify-center items-center">

                                        <div className="flex justify-center relative w-full">
                                            <h1 className='text-green text-3xl font-semibold'>{item.name}</h1>
                                        </div>
        
                                        {/* action button */}
                                        <div className=" space-x-2 w-full flex justify-center text-white text-center">
                                            <button onClick={() => toRekapNilai (item)} className='bg-purple hover:bg-white hover:text-purple duration-300 p-2 rounded-md w-full'>Lihat Nilai</button>
                                            <button onClick={() => toDetailNilai (item)} className='bg-purple hover:bg-white hover:text-purple duration-300 p-2 rounded-md w-full'>Detail Nilai</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* akhir konten utama */}

                    {/* footer */}
                    <Footer />
                    {/* akhir footer */}

                </div>
                {/* akhir wrapper konten utama */}
            </div>
        </>
    )
}

export default ukt_jambon