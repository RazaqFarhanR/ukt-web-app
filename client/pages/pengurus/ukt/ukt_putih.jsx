import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Footer from '../components/footer'
import Modal_event from '../components/modal_event'
import Modal_delete from '../components/modal_delete'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ukt_putih = () => {

    // deklarasi router
    const router = useRouter()

    // state modal
    const [showModalEvent, setShowModalEvent] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    // state
    const [dataUser, setDataUser] = useState({})
    const [dataEvent, setDataEvent] = useState([])
    const [dataRanting, setDataRanting] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [action, setAction] = useState('')
    const [idEvent, setIdEvent] = useState('')
    const [name, setName] = useState('')
    const [date, setDate] = useState()
    const [tipe, setTipe] = useState('')

    // function get data ranting
    const getDataRanting = () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('pengurus')
        const dataUser = JSON.parse(user)
        setDataUser(dataUser)
        axios.get(BASE_URL + `ranting`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataRanting(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function get data event
    const getDataEvent = () => {
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + `event/ukt/UKT Putih`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataEvent(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function to detail nilai
    const goToEventRanting = (item) => {
        // localStorage.setItem('event', JSON.stringify(item))
        router.push({
            pathname: './ranting',
            query: { ranting: item, ukt: 'UKT Putih', tipe: 'ukt_putih' } // Add your parameter here
        });
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('pengurus') === null) {
            router.push('/pengurus/login')
        }
    }


    useEffect(() => {
        getDataEvent()
        getDataRanting()
        isLogged()
    }, [])

    return (
        <>
            <div className="flex font-lato">

                {/* sidebar */}
                <div className="hidden lg:block">
                    <Sidebar />
                </div>
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
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center text-white mb-7 gap-y-4">

                            {/* page name */}
                            <h1 className='text-xl md:text-2xl tracking-wider uppercase font-bold'>
                                REKAP - UKT PUTIH
                            </h1>

                            {/* search and buttons wrapper */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                                {/* search input */}
                                <div className="bg-purple rounded-md px-4 py-2 flex items-center gap-x-2 w-full md:w-72 border border-transparent focus-within:border-white/30">
                                    <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                        className='bg-transparent placeholder:text-white/70 placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none text-white'
                                        placeholder='Search'
                                        type="text"
                                    />
                                </div>

                                {/* Actions Group: Back and Add Button */}
                                <div className="flex gap-2 w-full md:w-auto">

                                    {/* button back to home */}
                                    <button
                                        onClick={() => router.push('/pengurus')} // or your navigation logic
                                        className="bg-navy border border-purple hover:bg-purple text-white duration-300 rounded-md px-4 py-2 flex items-center justify-center gap-x-2 flex-1 md:flex-none transition-colors active:scale-95"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="text-sm md:text-base font-semibold hidden sm:inline">Back</span>
                                    </button>

                                </div>
                            </div>
                        </div>
                        {/* ranting data count wrapper */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3">

                            {/* card ranting */}
                            {dataUser.id_role === 'pengurus ranting'
                                ? <><button 
                                        onClick={() => goToEventRanting(dataUser.id_ranting)} key={1} 
                                        className="bg-navy hover:scale-105 transition ease-in-out duration-500 hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">
    
                                            {/* inner bg */}
                                            <div className="bg-navy shadow drop-shadow-lg rounded-md p-5 text-center">
    
                                                {/* ranting name */}
                                                <h1 className='text-xl font-semibold text-green tracking-wide truncate'>Ranting {dataUser.id_ranting}</h1>
    
                                                {/* ranting data count and add button */}
                                                <h1 className='text-white text-3xl font-semibold tracking-wider'>{dataEvent.filter(a => a.id_ranting === `${dataUser.id_ranting}`).length}</h1>
                                            </div>
                                        </button>
                                    </>
                                : dataRanting?.map((item, index) => (
                                    <><button 
                                        onClick={() => goToEventRanting(item.id_ranting)} key={index + 1} 
                                        className="bg-navy hover:scale-105 transition ease-in-out duration-500 hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">
    
                                            {/* inner bg */}
                                            <div className="bg-navy shadow drop-shadow-lg rounded-md p-5 text-center">
    
                                                {/* ranting name */}
                                                <h1 className='text-xl font-semibold text-green tracking-wide truncate'>Ranting {item.id_ranting}</h1>
    
                                                {/* ranting data count and add button */}
                                                <h1 className='text-white text-3xl font-semibold tracking-wider'>{dataEvent.filter(a => a.id_ranting === `${item.id_ranting}`).length}</h1>
                                            </div>
                                        </button>
                                    </>
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

            {/* memanggil modal */}
            <globalState.Provider value={{ showModalEvent, setShowModalEvent, setDataEvent, action, idEvent, name, setName, date, setDate, tipe, setTipe, isActive, setIsActive }}>
                <Modal_event />
            </globalState.Provider>

            <globalState.Provider value={{ showModalDelete, setShowModalDelete, setDataEvent, action, idEvent, tipe, setTipe }}>
                <Modal_delete />
            </globalState.Provider>
        </>
    )
}

export default ukt_putih