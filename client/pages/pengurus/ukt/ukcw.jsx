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

const ukcw = () => {

    // deklarasi router
    const router = useRouter ()
    
    // state modal
    const [showModalEvent, setShowModalEvent] = useState (false)
    const [showModalDelete, setShowModalDelete] = useState (false)

    // state
    const [dataEvent, setDataEvent] = useState ([])
    const [action, setAction] = useState ('')
    const [idEvent, setIdEvent] = useState ('')
    const [name, setName] = useState ('')
    const [date, setDate] = useState ('')
    const [tipe, setTipe] = useState ('')

    // funtion get data event
    const getDataEvent = () => {
        const token = localStorage.getItem ('token')

        axios.get (BASE_URL + `event/ukt/UKCW`, { headers: { Authorization: `Bearer ${token}`}})
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
        setTipe ('UKCW')
    }

    // function modal edit
    const editModal = (selectedItem) => {
        setShowModalEvent (true)
        setAction ('update')
        setIdEvent (selectedItem.id_event)
        setName (selectedItem.name)
        setDate (selectedItem.date)
        setTipe ('UKCW')
    }

    // function modal delete
    const deleteModal = (selectedId) => {
        setShowModalDelete (true)
        setAction ('deleteEvent')
        setIdEvent (selectedId)
        setTipe ('UKCW')
    }

    // function to rekap nilai
    const toRekapNilai = (item) => {
        localStorage.setItem ('event', JSON.stringify (item))
        router.push ('./rekap_nilai_ukt_ukcw')
    }

    // function to detail nilai
    const toDetailNilai = (item) => {
        localStorage.setItem ('event', JSON.stringify (item))
        router.push ('./detail_nilai_ukt_ukcw')
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
                            <h1 className='text-2xl tracking-wider uppercase font-bold'>REKAP - UKCW</h1>

                            {/* search and button add data */}
                            <div className="flex gap-x-3">
                                <div className="bg-purple rounded-md px-5 py-2 flex items-center gap-x-2 w-72">
                                    <svg className='z-50' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input className='bg-transparent placeholder:text-white placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none' placeholder='Search' type="text" />
                                </div>

                                {/* button add data */}
                                <button onClick={() => addModal()} className="bg-purple hover:bg-white hover:text-purple duration-300 rounded-md px-5 py-2 flex items-center gap-x-2">
                                    <h1>Tambah Data</h1>
                                </button>
                            </div>

                        </div>

                        {/* wrapper card event */}
                        <div className="grid grid-cols-2 gap-5">
                            
                            {/* card event */}
                            {dataEvent.map((item, index) => (
                                <div key={index + 1} className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">

                                    {/* inner bg */}
                                    <div className="bg-navy p-5 rounded-md space-y-3 flex flex-col justify-center items-center">

                                        <div className="flex justify-center relative w-full">
                                            <h1 className='text-green text-3xl font-semibold'>{item.name}</h1>

                                            <div className="flex items-center absolute right-0 gap-x-3">
                                                <button onClick={() => editModal(item)}>
                                                    <svg className='stroke-white hover:stroke-green duration-300' width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 31.6667H33.25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M26.125 5.54166C26.7549 4.91177 27.6092 4.55791 28.5 4.55791C28.9411 4.55791 29.3778 4.64478 29.7853 4.81358C30.1928 4.98237 30.5631 5.22977 30.875 5.54166C31.1869 5.85355 31.4343 6.22382 31.6031 6.63132C31.7719 7.03883 31.8588 7.47559 31.8588 7.91666C31.8588 8.35774 31.7719 8.7945 31.6031 9.202C31.4343 9.60951 31.1869 9.97977 30.875 10.2917L11.0833 30.0833L4.75 31.6667L6.33333 25.3333L26.125 5.54166Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                                <button onClick={() => deleteModal(item.id_event)}>
                                                    <svg className='stroke-white hover:stroke-red duration-300' width="30" height="30" viewBox="0 0 29 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.1543 5.76929L5.64468 29.6154C5.71547 30.9933 6.71776 32.0001 8.0293 32.0001H21.7408C23.0576 32.0001 24.0412 30.9933 24.1255 29.6154L25.6158 5.76929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M1.76953 5.76929H28.0003H1.76953Z" fill="black"/>
                                                        <path d="M1.76953 5.76929H28.0003" strokeWidth="2" strokeLinecap="round"/>
                                                        <path d="M10.1157 5.76924V2.78847C10.115 2.55341 10.1608 2.32054 10.2504 2.10324C10.3401 1.88594 10.4718 1.68851 10.638 1.5223C10.8042 1.35609 11.0016 1.22438 11.2189 1.13474C11.4362 1.04511 11.6691 0.999319 11.9041 1.00001H17.8657C18.1007 0.999319 18.3336 1.04511 18.5509 1.13474C18.7682 1.22438 18.9656 1.35609 19.1319 1.5223C19.2981 1.68851 19.4298 1.88594 19.5194 2.10324C19.609 2.32054 19.6548 2.55341 19.6541 2.78847V5.76924M14.8849 10.5385V27.2308M9.51953 10.5385L10.1157 27.2308M20.2503 10.5385L19.6541 27.2308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
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

            {/* memanggil modal */}
            <globalState.Provider value={{ showModalEvent, setShowModalEvent, setDataEvent, action, idEvent, name, setName, date, setDate, tipe, setTipe }}>
                <Modal_event />
            </globalState.Provider>

            <globalState.Provider value={{ showModalDelete, setShowModalDelete, setDataEvent, action, idEvent, tipe, setTipe }}>
                <Modal_delete />
            </globalState.Provider>
        </>
    )
}

export default ukcw