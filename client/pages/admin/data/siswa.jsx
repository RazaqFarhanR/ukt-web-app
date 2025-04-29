import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { globalState } from '@/context/context'
import { useRouter } from 'next/router'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Footer from '../components/footer'
import Modal_CSV from '../components/modal_csv'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const siswa = () => {

    // deklarasi router
    const router = useRouter()

    // state
    const [dataRanting, setDataRanting] = useState([])
    const [showModalCSV, setShowModalCSV] = useState(false);

    const [tipe, setTipe] = useState('')
    const [dataEvent, setDataEvent] = useState([])

    // function get data ranting
    // const getDataRanting = () => {
    //     const admin = JSON.parse(localStorage.getItem('admin'))
    //     const token = localStorage.getItem('token')

    //     if (admin.id_role == 'admin cabang' || admin.id_role == 'super admin') {
    //         axios.get(BASE_URL + `siswa/count`, { headers: { Authorization: `Bearer ${token}` } })
    //             .then(res => {
    //                 setDataRanting(res.data.data)
    //                 setRanting(res.data.data.id_ranting)
    //             })
    //             .catch(err => {
    //                 console.log(err.message);
    //             })
    //     } else {
    //         axios.get(BASE_URL + `ranting/${admin.id_ranting}`, { headers: { Authorization: `Bearer ${token}` } })
    //             .then(res => {
    //                 setDataRanting(res.data.data)
    //                 setRanting(res.data.data.name)
    //             })
    //             .catch(err => {
    //                 console.log(err.message);
    //             })
    //     }
    // }

    const dataTipe = [
        { name: 'UKT Jambon' },
        { name: 'UKT Hijau' },
        { name: 'UKT Putih' },
        { name: 'UKCW' },
    ]

    const getDataEventByTipe = () => {
        const admin = JSON.parse(localStorage.getItem('admin'))
        const token = localStorage.getItem('token')

        if (tipe){
            if (admin.id_role === "admin ranting" && tipe !== "ukcw") {
                axios.get(BASE_URL + `event/ukt/${tipe}/${admin.id_ranting}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    setDataEvent(res.data.data)
                })
                .catch(err => {
                    console.log(err.message);
                })
            } else {
                axios.get(BASE_URL + `event/ukt/${tipe}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    setDataEvent(res.data.data)
                })
                .catch(err => {
                    console.log(err.message);
                })
            }
        }
    }

    useEffect(() => {
        getDataEventByTipe()
    }, [tipe])

    // function go to detail siswa
    const goToDetailSiswa = (item) => {
        localStorage.setItem ('event', JSON.stringify (item))
        router.push({
            pathname: './detail_siswa',
            query: { eventId: item.id_event, name: item.name } // Add your parameter here
        });
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        isLogged()
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
                            <div className='flex justify-center items-center gap-x-3'>
                                <h1 className='text-2xl tracking-wider uppercase font-bold'>Data Siswa</h1>
                                {tipe && <button
                                    onClick={() => setTipe(null)}
                                    className='p-2 bg-red rounded-md'>Back</button>
                                }
                            </div>

                            {/* upload data siswa via CSV */}
                            <button
                                onClick={() => setShowModalCSV(true)}
                                className="bg-purple hover:bg-indigo-600 rounded-md px-5 py-2 flex items-center gap-x-2 w-72">
                                ADD VIA CSV
                                {/* <svg className='z-50' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg> */}
                            </button>
                        </div>
                        {/* PILIH TIPE UKT $$$ */}
                        {!tipe ? <div className="grid grid-cols-4 gap-x-5 gap-y-3">

                            {/* card ranting */}
                            {dataTipe.map((item, index) => (
                                <button onClick={() => setTipe(item.name)} key={index + 1} className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">

                                    {/* inner bg */}
                                    <div className="bg-navy p-5 rounded-md space-y-5">

                                        {/* ranting name */}
                                        <h1 className='text-green text-lg'>{item.name}</h1>
                                    </div>
                                </button>
                            ))}
                        </div>
                            : <div className="grid grid-cols-4 gap-x-5 gap-y-3">

                                {/* card ranting */}
                                {dataEvent.map((item, index) => (
                                    <button onClick={() => goToDetailSiswa(item)}
                                    key={index + 1} 
                                    className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">

                                        {/* inner bg */}
                                        <div className="bg-navy p-5 rounded-md space-y-5">

                                            {/* ranting name */}
                                            <h1 className='text-green text-lg'>{item.name}</h1>
                                        </div>
                                    </button>
                                ))}
                            </div>}
                    </div>
                    {/* akhir konten utama */}

                    {/* footer */}
                    <Footer />
                    {/* akhir footer */}

                </div>
                {/* akhir wrapper konten utama */}
            </div>
            <globalState.Provider value={{ showModalCSV, setShowModalCSV }}>
                <Modal_CSV />
            </globalState.Provider>
        </>
    )
}

export default siswa