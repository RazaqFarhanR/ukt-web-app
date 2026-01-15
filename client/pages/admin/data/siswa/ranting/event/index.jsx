import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { globalState } from '@/context/context'
import { useRouter } from 'next/router'
import Sidebar from '../../../../components/sidebar'
import Header from '../../../../components/header'
import Footer from '../../../../components/footer'
import Modal_CSV from '../../../../components/modal_csv'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const siswa = () => {

    // deklarasi router
    const router = useRouter()
    const idTipe = router.query.tipe
    const idRanting = router.query.ranting

    // state
    const [showModalCSV, setShowModalCSV] = useState(false);
    const [datasiswa, setDatasiswa] = useState([])

    // function get data siswa
    const getDatasiswa = () => {
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + `siswa/count/siswa/${idTipe}/${idRanting}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDatasiswa(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function go to detail siswa
    const goToRantingSiswa = (item) => {
        router.push({
            pathname: `/admin/data/siswa/ranting/event/detail`,
            query: { eventId: item.id_event, tipe: idTipe, ranting: idRanting, name: item?.siswa_event?.name }
        });
    }
    const goBack = () => {
        router.push({
            pathname: `/admin/data/siswa/ranting`,
            query: { tipe: idTipe }
        });
    }
    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        console.log(idTipe)
        getDatasiswa()
        isLogged()
    }, [idTipe])

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
                        <div className="flex justify-start space-x-4 items-center text-white mb-7">

                            {/* page name */}
                            <button type='button' onClick={goBack} className="bg-purple hover:bg-white rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                                <svg className='-translate-x-0.5 fill-white group-hover:fill-purple' width="13" height="22" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.2258 26.4657L0.354838 14.4974C0.225806 14.3549 0.134623 14.2005 0.08129 14.0343C0.0270964 13.8681 0 13.69 0 13.5C0 13.31 0.0270964 13.1319 0.08129 12.9657C0.134623 12.7995 0.225806 12.6451 0.354838 12.5026L11.2258 0.498681C11.5269 0.166227 11.9032 0 12.3548 0C12.8065 0 13.1935 0.1781 13.5161 0.534301C13.8387 0.890501 14 1.30607 14 1.781C14 2.25594 13.8387 2.6715 13.5161 3.0277L4.03226 13.5L13.5161 23.9723C13.8172 24.3048 13.9677 24.7141 13.9677 25.2005C13.9677 25.6878 13.8065 26.1095 13.4839 26.4657C13.1613 26.8219 12.7849 27 12.3548 27C11.9247 27 11.5484 26.8219 11.2258 26.4657Z" />
                                </svg>
                            </button>
                            <h1 className='text-2xl tracking-wider uppercase font-bold'>Data siswa</h1>

                        </div>
                        {/* ranting data count wrapper */}
                        <div className="grid grid-cols-4 gap-x-5 gap-y-3">

                            {/* card ranting */}
                            {datasiswa?.map((item, index) => (
                                <button onClick={() => goToRantingSiswa(item)} key={index + 1} href={'./' + item.id_ranting} className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">

                                    {/* inner bg */}
                                    <div className="bg-navy p-5 rounded-md space-y-5">

                                        {/* ranting name */}
                                        <div className='flex justify-between'>
                                            <h1 className='text-green text-lg'>{item.siswa_event.name}</h1>
                                        </div>

                                        <h1 className='text-yellow text-3xl'>{item.count_event}</h1>
                                        {/* ranting data count and add button */}
                                        <div className='flex justify-between'>
                                            <h1 className='text-white text-md font-semibold tracking-wider'>{item.count_active}</h1>
                                            <h1 className='text-gray text-md font-semibold tracking-wider'>{item.count_disabled}</h1>
                                        </div>
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