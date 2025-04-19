import React, { useState, createContext, useRef, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Footer from '../components/footer'
import { globalState } from '@/context/context'
import Modal_Filter from '../components/modal_filter';
import event from '@/pages/penguji/event'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const rekap_nilai_ukt_hijau = () => {
    const [dataUkt, setDataUkt] = useState([])

    // state modal
    const [dataEvent, setDataEvent] = useState([])
    const [dataRanting, setDataRanting] = useState([])
    const [modalFilter, setModalFilter] = useState(false)
    const [jenis, setJenis] = useState('all')
    const [updown, setUpDown] = useState('upToDown')
    
    const getDataUktFiltered = () => {
        const token = localStorage.getItem('token')
        const event = JSON.parse(localStorage.getItem('event'));
        let form = {
            ranting: dataRanting
        }
        if (jenis && updown) {
            axios.post(BASE_URL + `ukt_siswa/ukt/${event.id_event}/${jenis}/${updown}`, form, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    console.log(res);
                    setDataUkt(res.data.data)
                })
                .catch(err => {
                    console.log(err.message);
                })
        }
    }

    function formatNumber(number) {
        return (number % 1 === 0)
            ? number
            : number.toLocaleString('id', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    useEffect(() => {
        const event = JSON.parse(localStorage.getItem('event'));
        setDataEvent(event)
    }, [])

    useEffect(() => {
        console.log(jenis)
        console.log("updown" + updown)
        getDataUktFiltered()
    }, [dataRanting, jenis, updown])
    return (
        <>
            <div className="flex font-lato">

                {/* sidebar */}
                <Sidebar />
                {/* akhir sidebar */}

                {/* awal wrapper konten utama */}
                {/* supaya konten header dapat di scroll dan tidak mempengaruhi sidebar */}
                <div className="w-full overflow-y-auto h-screen scrollbar-hide">

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
                                <Link href={'./ukcw'} className="bg-purple hover:bg-white rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                                    <svg className='-translate-x-0.5 fill-white group-hover:fill-purple' width="13" height="22" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2258 26.4657L0.354838 14.4974C0.225806 14.3549 0.134623 14.2005 0.08129 14.0343C0.0270964 13.8681 0 13.69 0 13.5C0 13.31 0.0270964 13.1319 0.08129 12.9657C0.134623 12.7995 0.225806 12.6451 0.354838 12.5026L11.2258 0.498681C11.5269 0.166227 11.9032 0 12.3548 0C12.8065 0 13.1935 0.1781 13.5161 0.534301C13.8387 0.890501 14 1.30607 14 1.781C14 2.25594 13.8387 2.6715 13.5161 3.0277L4.03226 13.5L13.5161 23.9723C13.8172 24.3048 13.9677 24.7141 13.9677 25.2005C13.9677 25.6878 13.8065 26.1095 13.4839 26.4657C13.1613 26.8219 12.7849 27 12.3548 27C11.9247 27 11.5484 26.8219 11.2258 26.4657Z" />
                                    </svg>
                                </Link>
                                <h1 className='text-2xl tracking-wider uppercase font-bold'>Rekap Nilai - {dataEvent.name}</h1>
                            </div>

                            {/* search */}
                            <div className="bg-purple rounded-md px-5 py-2 flex items-center gap-x-2 w-72">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input className='bg-transparent placeholder:text-white placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none' placeholder='Search' type="text" />
                            </div>
                        </div>

                        {/* wrapper table */}
                        <div className="bg-navy rounded-md py-2 px-3 uppercase">

                            {/* table */}
                            <table className='w-full table-fixed'>
                                <thead>
                                    <tr className='text-white text-center border bg-purple'>
                                        <th className='py-3 w-[5%] border font-oswald'>Rank</th>
                                        <th className='w-[30%] border font-oswald' >Nama <button className='mx-3 rounded-md bg-gray text-xl' onClick={() => setModalFilter(true)}>⌃</button></th>
                                        <th className='w-[10%] border font-oswald'>Ranting</th>
                                        <th className='text-base border font-oswald'>KESHAN {jenis == 'keshan' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('keshan');
                                                    setUpDown('downToUp');
                                                }}>⌄</button>
                                                : <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('keshan');
                                                    setUpDown('upToDown');
                                                }}>⌃</button>}</th>
                                        <th className='text-base border font-oswald'>Senam {jenis == 'senam' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('senam');
                                                    setUpDown('downToUp');
                                                }}>⌄</button>
                                                : <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('senam');
                                                    setUpDown('upToDown');
                                                }}>⌃</button>}</th>
                                        <th className='text-base border font-oswald'>Jurus {jenis == 'jurus' && updown == 'upToDown'
                                            ? <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                setJenis('jurus');
                                                setUpDown('downToUp');
                                            }}>⌄</button>
                                            : <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                setJenis('jurus');
                                                setUpDown('upToDown');
                                            }}>⌃</button>}</th>
                                        <th className='text-base border font-oswald'>Fisik {jenis == 'fisik' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('fisik');
                                                    setUpDown('downToUp');
                                                }}>⌄</button>
                                                : <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('fisik');
                                                    setUpDown('upToDown');
                                                }}>⌃</button>}</th>
                                        <th className='text-base border font-oswald'>Teknik {jenis == 'teknik' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('teknik');
                                                    setUpDown('downToUp');
                                                }}>⌄</button>
                                                : <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('teknik');
                                                    setUpDown('upToDown');
                                                }}>⌃</button>}</th>
                                        <th className='text-base w-[10%] border font-oswald'>Sambung {jenis == 'sambung' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('sambung');
                                                    setUpDown('downToUp');
                                                }}>⌄</button>
                                                : <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('sambung');
                                                    setUpDown('upToDown');
                                                }}>⌃</button>}</th>
                                        <th className='text-base border font-oswald'>Rata-rata {jenis == 'all' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('all');
                                                    setUpDown('downToUp');
                                                }}>⌄</button>
                                                : <button className='rounded-md bg-gray text-lg' onClick={() => {
                                                    setJenis('all');
                                                    setUpDown('upToDown');
                                                }}>⌃</button>}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataUkt.map((item, index) => (
                                        <tr key={index+1} className={'text-white text-center even:bg-darkBlue border-t border-gray-100 border font-bold'}>
                                            <td className='border-b-2 py-3 border-gray text-purple font-bold border'>{index + 1}</td>
                                            <td className='border-b-2 border-gray text-left border px-2'>{item.siswa_ukt_siswa.name} [{item.siswa_ukt_siswa.nomor_urut}]</td>
                                            <td className='border-b-2 border-gray border'>{item.siswa_ukt_siswa.siswa_ranting.name}</td>
                                            <td className={`border-b-2 border-gray border text-lg ${item.keshan < 50 && 'text-[#ca3030]'} ${item.keshan > 89.99 && 'text-[#7dff5d]'}`}>{(item.keshan)}</td>
                                            <td className={`border-b-2 border-gray border text-lg ${item.senam < 50 && 'text-[#ca3030]'} ${item.senam > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item.senam)}</td>
                                            <td className={`border-b-2 border-gray border text-lg ${item.jurus < 50 && 'text-[#ca3030]'} ${item.jurus > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item.jurus)}</td>
                                            <td className={`border-b-2 border-gray border text-lg ${item.fisik < 50 && 'text-[#ca3030]'} ${item.fisik > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item.fisik)}</td>
                                            <td className={`border-b-2 border-gray border text-lg ${item.teknik < 50 && 'text-[#ca3030]'} ${item.teknik > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item.teknik)}</td>
                                            <td className={`border-b-2 border-gray border text-lg ${item.sambung < 50 && 'text-[#ca3030]'} ${item.sambung > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item.sambung)}</td>
                                            <td className={`border-b-2 border-gray border font-bold text-lg ${((item.keshan + item.senam + item.jurus + item.fisik + item.teknik + item.sambung) / 6) < 50 && 'bg-[#371b1b]'} ${((item.keshan + item.senam + item.jurus + item.fisik + item.teknik + item.sambung) / 6) > 89.99 && 'bg-[#1f371b]'} `}>
                                                {((item.keshan + item.senam + item.jurus + item.fisik + item.teknik + item.sambung) / 6).toLocaleString('id', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <globalState.Provider value={{ modalFilter, setModalFilter, dataRanting, setDataRanting, jenis, setJenis, updown, setUpDown }}>
                            <Modal_Filter />
                        </globalState.Provider>

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

export default rekap_nilai_ukt_hijau