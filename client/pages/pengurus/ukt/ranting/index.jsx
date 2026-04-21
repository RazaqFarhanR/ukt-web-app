import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Modal_event from '../../components/modal_event'
import Modal_delete from '../../components/modal_delete'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ukt_hijau = () => {

    // deklarasi router
    const router = useRouter()

    const idRanting = router.query.ranting
    const idUkt = router.query.ukt
    const idTipe = router.query.tipe

    // state modal
    const [showModalEvent, setShowModalEvent] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    // state
    const [dataEvent, setDataEvent] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [ranting, setRanting] = useState()
    const [action, setAction] = useState('')
    const [idEvent, setIdEvent] = useState('')
    const [name, setName] = useState('')
    const [date, setDate] = useState()
    const [tipe, setTipe] = useState('')

    // function get data event
    const getDataEvent = () => {
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + `event/ukt/${idUkt}/${idRanting}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataEvent(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function modal add
    const addModal = () => {
        setShowModalEvent(true)
        setAction('insert')
        setName('')
        setDate('')
        setTipe(idUkt)
        setRanting(idRanting)
        setIsActive(true)
    }

    // function modal edit
    const editModal = (selectedItem) => {
        setShowModalEvent(true)
        setAction('update')
        setIdEvent(selectedItem.id_event)
        setName(selectedItem.name)
        setDate(selectedItem.tanggal)
        setTipe(idUkt)
        setRanting(idRanting)
        setIsActive(selectedItem.is_active)
    }

    // function modal delete
    const deleteModal = (selectedId) => {
        setShowModalDelete(true)
        setAction('deleteEvent')
        setIdEvent(selectedId)
        setTipe(idUkt)
    }

    // function to rekap nilai
    const toRekapNilai = (item) => {
        localStorage.setItem('event', JSON.stringify(item))
        router.push({
            pathname: './ranting/event/rekap_nilai_' + idTipe,
            query: { eventId: item.id_event, idRanting: idRanting, nameEvent: item.name } // Add your parameter here
        });
    }

    // function to detail nilai
    const toDetailNilai = (item) => {
        localStorage.setItem('event', JSON.stringify(item))
        router.push({
            pathname: './ranting/event/detail_nilai_' + idTipe,
            query: { eventId: item.id_event, idRanting: idRanting, nameEvent: item.name } // Add your parameter here
        });
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        if (!router.isReady) return;
        getDataEvent()
        isLogged()
    }, [router.isReady, idRanting, idUkt, idTipe])

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
                                REKAP - {idUkt}
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

                                {/* Actions Group: Back, Dashboard, and Add Button */}
                                <div className="flex gap-2 w-full md:w-auto">

                                    {/* button back to previous page */}
                                    <button
                                        onClick={() => router.push('/pengurus/ukt/' + idTipe)}
                                        className="bg-navy border border-purple hover:bg-purple text-white duration-300 rounded-md px-3 md:px-4 py-2 flex items-center justify-center gap-x-2 flex-1 md:flex-none transition-colors active:scale-95"
                                        title="Go Back"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="text-sm md:text-base font-semibold hidden lg:inline">Back</span>
                                    </button>

                                    {/* button home/dashboard */}
                                    <button
                                        onClick={() => router.push('/pengurus')} // adjust path as needed
                                        className="bg-navy border border-purple hover:bg-purple text-white duration-300 rounded-md px-3 md:px-4 py-2 flex items-center justify-center gap-x-2 flex-1 md:flex-none transition-colors active:scale-95"
                                        title="Dashboard"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                        </svg>
                                        <span className="text-sm md:text-base font-semibold hidden lg:inline">Home</span>
                                    </button>

                                    {/* button add data (Primary Action) */}
                                    <button
                                        onClick={() => addModal()}
                                        className="bg-purple hover:bg-white hover:text-purple duration-300 rounded-md px-4 md:px-5 py-2 flex items-center justify-center gap-x-2 flex-[2] md:flex-none transition-colors active:scale-95 text-white"
                                    >
                                        <span className="text-sm md:text-base font-semibold whitespace-nowrap">Tambah Data</span>
                                        <span className="md:hidden text-lg">+</span>
                                    </button>

                                </div>
                            </div>
                        </div>

                        {/* wrapper card event */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

                            {/* card event */}
                            {dataEvent.map((item, index) => (
                                <div key={index + 1} className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-lg p-0.5 transition-all">

                                    {/* inner bg */}
                                    <div className="bg-navy p-4 md:p-5 rounded-lg space-y-4 flex flex-col h-full">

                                        {/* Header: Name and Action Icons */}
                                        <div className="flex justify-between items-start w-full gap-x-2">
                                            <h1 className='text-green text-xl md:text-3xl font-semibold break-words'>
                                                {item.name}
                                            </h1>

                                            <div className="flex items-center gap-x-2 shrink-0">
                                                <button onClick={() => editModal(item)} className="p-1">
                                                    <svg className='stroke-white hover:stroke-green duration-300 w-6 h-6 md:w-8 md:h-8' viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 31.6667H33.25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M26.125 5.54166C26.7549 4.91177 27.6092 4.55791 28.5 4.55791C28.9411 4.55791 29.3778 4.64478 29.7853 4.81358C30.1928 4.98237 30.5631 5.22977 30.875 5.54166C31.1869 5.85355 31.4343 6.22382 31.6031 6.63132C31.7719 7.03883 31.8588 7.47559 31.8588 7.91666C31.8588 8.35774 31.7719 8.7945 31.6031 9.202C31.4343 9.60951 31.1869 9.97977 30.875 10.2917L11.0833 30.0833L4.75 31.6667L6.33333 25.3333L26.125 5.54166Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => deleteModal(item.id_event)} className="p-1">
                                                    <svg className='stroke-white hover:stroke-red duration-300 w-6 h-6 md:w-8 md:h-8' viewBox="0 0 29 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.1543 5.76929L5.64468 29.6154C5.71547 30.9933 6.71776 32.0001 8.0293 32.0001H21.7408C23.0576 32.0001 24.0412 30.9933 24.1255 29.6154L25.6158 5.76929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M1.76953 5.76929H28.0003" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M10.1157 5.76924V2.78847C10.115 2.55341 11.9041 1.00001H17.8657C19.6541 2.78847V5.76924M14.8849 10.5385V27.2308M9.51953 10.5385L10.1157 27.2308M20.2503 10.5385L19.6541 27.2308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Footer: Action buttons */}
                                        <div className="flex flex-col sm:flex-row gap-2 w-full mt-auto">
                                            <button
                                                onClick={() => toRekapNilai(item)}
                                                className='bg-purple hover:bg-white hover:text-purple duration-300 py-2.5 px-2 rounded-md w-full text-sm md:text-base text-white font-medium'
                                            >
                                                Lihat Nilai
                                            </button>
                                            <button
                                                onClick={() => toDetailNilai(item)}
                                                className='bg-purple hover:bg-white hover:text-purple duration-300 py-2.5 px-2 rounded-md w-full text-sm md:text-base text-white font-medium'
                                            >
                                                Detail Nilai
                                            </button>
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
            <globalState.Provider value={{ showModalEvent, setShowModalEvent, setDataEvent, action, idEvent, name, setName, date, setDate, tipe, setTipe, isActive, setIsActive, ranting, setRanting }}>
                <Modal_event />
            </globalState.Provider>

            <globalState.Provider value={{ showModalDelete, setShowModalDelete, setDataEvent, action, idEvent, tipe, setTipe }}>
                <Modal_delete />
            </globalState.Provider>
        </>
    )
}

export default ukt_hijau