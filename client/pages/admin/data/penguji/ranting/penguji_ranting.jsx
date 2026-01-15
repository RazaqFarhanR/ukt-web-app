import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { globalState } from '@/context/context'
import { useRouter } from 'next/router'
import Sidebar from '../../../components/sidebar'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import Modal_CSV from '../../../components/modal_csv'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const siswa = () => {

    // deklarasi router
    const router = useRouter()

    // state
    const [dataRanting, setDataRanting] = useState([])
    const [showModalCSV, setShowModalCSV] = useState(false);
    const [dataPenguji, setDataPenguji] = useState([])


    // function get data ranting
    const getDataRanting = () => {
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + `ranting`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataRanting(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function get data penguji
    const getDataPenguji = () => {
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + `penguji/count/penguji`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataPenguji(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function go to detail siswa
    const goToDetailSiswa = (item) => {
        router.push('./' + item.id_ranting)
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        getDataRanting()
        getDataPenguji()
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
                            <h1 className='text-2xl tracking-wider uppercase font-bold'>Data Penguji</h1>

                        </div>
                        {/* ranting data count wrapper */}
                        <div className="grid grid-cols-4 gap-x-5 gap-y-3">

                            {/* card ranting */}
                            {dataPenguji?.map((item, index) => (
                                <button onClick={() => goToDetailSiswa(item)} key={index + 1} href={'./' + item.id_ranting} className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">

                                    {/* inner bg */}
                                    <div className="bg-navy p-5 rounded-md space-y-5">

                                        {/* ranting name */}
                                        <h1 className='text-green text-lg'>Ranting {item.id_ranting}</h1>

                                        {/* ranting data count and add button */}
                                        <h1 className='text-white text-3xl font-semibold tracking-wider'>{item.count_active}</h1>
                                        <h1 className='text-gray text-3xl font-semibold tracking-wider'>{item.count_disabled}</h1>
                                    </div>
                                </button>
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
            <globalState.Provider value={{ showModalCSV, setShowModalCSV }}>
                <Modal_CSV />
            </globalState.Provider>
        </>
    )
}

export default siswa