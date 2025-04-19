import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import axios from 'axios'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Footer from '../../components/footer'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const rekap_nilai_ukt_jambon = () => {
    const [dataUktPutih, setDataUktPutih] = useState([])
    const getDataUktPutih = () => {
        const token = localStorage.getItem ('token')

        axios.get (BASE_URL + `ukt_siswa/ukt/UKT Putih`, { headers: { Authorization: `Bearer ${token}`}})
        .then (res => {
            console.log(res.data.data);
            setDataUktPutih (res.data.data)
        })
        .catch (err => {
            console.log(err.message);
        })
    }

    useEffect (() => {
        getDataUktPutih ()
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

                            {/* page name and button back */}
                            <div className="flex justify-center items-center gap-x-3">
                                <Link href={'./ukt_jambon'} className="bg-purple hover:bg-white rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                                    <svg className='-translate-x-0.5 fill-white group-hover:fill-purple' width="13" height="22" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2258 26.4657L0.354838 14.4974C0.225806 14.3549 0.134623 14.2005 0.08129 14.0343C0.0270964 13.8681 0 13.69 0 13.5C0 13.31 0.0270964 13.1319 0.08129 12.9657C0.134623 12.7995 0.225806 12.6451 0.354838 12.5026L11.2258 0.498681C11.5269 0.166227 11.9032 0 12.3548 0C12.8065 0 13.1935 0.1781 13.5161 0.534301C13.8387 0.890501 14 1.30607 14 1.781C14 2.25594 13.8387 2.6715 13.5161 3.0277L4.03226 13.5L13.5161 23.9723C13.8172 24.3048 13.9677 24.7141 13.9677 25.2005C13.9677 25.6878 13.8065 26.1095 13.4839 26.4657C13.1613 26.8219 12.7849 27 12.3548 27C11.9247 27 11.5484 26.8219 11.2258 26.4657Z"/>
                                    </svg>
                                </Link>
                                <h1 className='text-2xl tracking-wider'>Rekap Nilai - UKT Putih 2023</h1>
                            </div>

                            {/* search */}
                            <div className="bg-purple rounded-md px-5 py-2 flex items-center gap-x-2 w-72">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <input className='bg-transparent placeholder:text-white placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none' placeholder='Search' type="text" />
                            </div>
                        </div>

                        {/* wrapper table */}
                        <div className="bg-navy rounded-md py-2 px-3">
                            
                            {/* table */}
                            <table className='w-full table-fixed'>
                                <thead>
                                    <tr className='text-green'>
                                        <th className='py-3 w-[5%]'>Rank</th>
                                        <th className='w-[35%]'>Nama</th>
                                        <th>KESHAN</th>
                                        <th>Senam</th>
                                        <th>Jurus</th>
                                        <th>Fisik</th>
                                        <th>Teknik</th>
                                        <th>Sambung</th>
                                        <th>Rata - Rata</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataUktPutih.map((item, index) => (
                                    <tr className='text-white text-center'>
                                        <td className='border-b-2 py-3 border-gray'>{item.siswa_ukt_siswa.tingkatan}</td>
                                        <td className='border-b-2 border-gray'>{item.siswa_ukt_siswa.name}</td>
                                        <td className='border-b-2 border-gray'>{item.keshan}</td>
                                        <td className='border-b-2 border-gray'>{item.senam}</td>
                                        <td className='border-b-2 border-gray'>{item.jurus}</td>
                                        <td className='border-b-2 border-gray'>{item.fisik}</td>
                                        <td className='border-b-2 border-gray'>{item.teknik}</td>
                                        <td className='border-b-2 border-gray'>{item.sambung}</td>
                                        <td className='border-b-2 border-gray'>{((item.keshan + item.senam + item.jurus + item.fisik + item.teknik + item.sambung) / 6).toFixed(2)}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
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

export default rekap_nilai_ukt_jambon