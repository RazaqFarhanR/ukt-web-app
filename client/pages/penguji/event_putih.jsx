import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from './components/header'
import axios from 'axios';
import { useRouter } from 'next/router';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const event = () => {

    // deklarasi router
    const router = useRouter()

    // state
    const [dataEvent, setDataEvent] = useState ([])

    // function get data event
    const getDataEvent = () => {
        const token = localStorage.getItem ('tokenPenguji')
        const penguji = JSON.parse(localStorage.getItem('penguji'))

        axios.get (BASE_URL + `event/ukt/UKT Putih/${penguji.id_ranting}`, { headers: { Authorization: `Bearer ${token}`}})
        .then (res => {
            setDataEvent (res.data.data)
        })
        .catch (err => {
            console.log(err.message);
        })
    }

    // function go to detail event
    const goToDetailEvent = (item) => {
        localStorage.setItem ('event', JSON.stringify (item))
        router.push ('./' + item.name)
    }

    useEffect (() => {
        getDataEvent ()
    }, [])

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
                        {dataEvent.map((item, index) => (
                            <button className='w-full' onClick={() => goToDetailEvent(item)} key={index + 1}>
                                <div className="hover:scale-105 transition ease-in-out duration-500 hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                    <div className="bg-navy shadow drop-shadow-lg rounded-md p-5 text-center">
                                        <h1 className='text-xl font-semibold text-green tracking-wide'>{item.name}</h1>
                                        <h1 className='text-white tracking-wider'>30 Siswa</h1>
                                    </div>
                                </div>
                            </button> 
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default event