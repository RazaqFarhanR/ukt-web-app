import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const modal_siswa = () => {

    const dataRanting = [
        { label: 'BENDUNGAN', value: 'BENDUNGAN' },
        { label: 'DONGKO', value: 'DONGKO' },
        { label: 'DURENAN', value: 'DURENAN' },
        { label: 'GANDUSARI', value: 'GANDUSARI' },
        { label: 'KAMPAK', value: 'KAMPAK' },
        { label: 'KARANGAN', value: 'KARANGAN' },
        { label: 'MUNJUNGAN', value: 'MUNJUNGAN' },
        { label: 'PANGGUL', value: 'PANGGUL' },
        { label: 'POGALAN', value: 'POGALAN' },
        { label: 'PULE', value: 'PULE' },
        { label: 'SURUH', value: 'SURUH' },
        { label: 'TRENGGALEK', value: 'TRENGGALEK' },
        { label: 'TUGU', value: 'TUGU' },
        { label: 'WATULIMO', value: 'WATULIMO' }
    ]

    // state modal
    const {showModalSiswa, setShowModalSiswa} = useContext (globalState)
    const router = useRouter()
    const { eventId, name } = router.query

    // state
    const {setDataSiswa, action, idSiswa} = useContext (globalState)
    const [dataEvent, setDateEvent] = useState ([])
    const {noUrut, setNoUrut} = useContext (globalState)
    const {siswaName, setSiswaName} = useContext (globalState)
    const {ranting, setRanting} = useContext (globalState)
    const {rayon, setRayon} = useContext (globalState)
    const {jenisKelamin, setJenisKelamin} = useContext (globalState)
    const {jenisLatihan, setJenisLatihan} = useContext (globalState)
    const {ukt, setUkt} = useContext (globalState)
    const {event, setEvent} = useContext (globalState)

    // function get data siswa
    const getDataSiswa = () => {
        const token = localStorage.getItem ('token')
        axios.get (BASE_URL + `siswa/event/new/${eventId}`, { headers: { Authorization: `Bearer ${token}`}})
        .then (res => {
            setDataSiswa (res.data.data)
        })
        .catch (err => {
            console.log(err.message);
        })
    }
    
    // function get data event
    const getDataEvent = () => {
        const token = localStorage.getItem ('token')
        axios.get (BASE_URL + `event`, { headers: { Authorization: `Bearer ${token}`}})
        .then (res => {
            setDateEvent (res.data.data)
        })
        .catch (err => {
            console.log(err.message);
        })
    }
    
    // function handle add and edit data
    const handleSave = (e) => {
        e.preventDefault()
        
        const token = localStorage.getItem ('token')
        
        let form = {
            nomor_urut : noUrut,
            name : siswaName,
            id_ranting : ranting,
            rayon : rayon,
            jenis_kelamin : jenisKelamin,
            jenis_latihan : jenisLatihan,
            tipe_ukt : ukt,
            id_event : event,
            id_role : 'siswa',
        }

        if (action === 'insert') {
            axios.post (BASE_URL + `siswa`, form, { headers: { Authorization: `Bearer ${token}`}})
            .then (res => {
                setShowModalSiswa (false)
                getDataSiswa ()
                // console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (action === 'update') {
            axios.put (BASE_URL + `siswa/${idSiswa}`, form, { headers: { Authorization: `Bearer ${token}`}})
            .then (res => {
                setShowModalSiswa (false)
                getDataSiswa ()
                // console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        }
    }

    useEffect (() => {
        getDataEvent ()
    }, [router.isReady])

    return (
        <>
        {showModalSiswa ? (
            <>
                {/* Main modal */}
                <div className="fixed flex justify-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
                    <div className="relative w-full h-full max-w-2xl md:h-auto">
                        
                        {/* Modal content */}
                        <div className="relative bg-navy text-white rounded-lg shadow">
                            
                            <form action="POST" onSubmit={handleSave}>

                                {/* Modal header */}
                                <div className="flex justify-center p-4">
                                    {(() => {
                                        if (action === 'insert') {
                                            return (
                                                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                                    Tambah Siswa
                                                </h1>
                                            )
                                        } else if (action === 'update') {
                                            return (
                                                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                                    Edit Siswa
                                                </h1>
                                            )
                                        }
                                    })()}
                                    <button onClick={() => setShowModalSiswa(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                        <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                            </path>
                                        </svg>  
                                    </button>
                                </div>

                                {/* Modal body */}
                                <div className="px-6 py-2 space-y-3">

                                    {/* Input nis */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Nomor Urut</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="number"
                                            value={noUrut}
                                            onChange={(e) => setNoUrut(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input nama */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Nama</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="text"
                                            value={siswaName}
                                            onChange={(e) => setSiswaName(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {ukt == "UKCW" &&
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-2/6 flex justify-between">
                                                <span>Ranting</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-4/6">
                                                <div className="relative w-full">
                                                    <div className='bg-darkBlue rounded-lg px-1'>
                                                        <select className='w-full bg-darkBlue focus:outline-none' 
                                                        name={ranting} value={ranting} onChange = {(e) => setRanting(e.target.value)} required
                                                        >
                                                            <option></option>
                                                            {dataRanting.map((item, index) => (
                                                                <option key={index + 1}
                                                                value={item.value}
                                                                >{item.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {/* Input rayon */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Rayon</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="text"
                                            value={rayon}
                                            onChange={(e) => setRayon(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input jenis kelamin */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Jenis Kelamin</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <div className="relative w-full">
                                                <div className='bg-darkBlue rounded-lg px-2'>
                                                    <select className='w-full bg-darkBlue focus:outline-none' 
                                                    name={jenisKelamin} value={jenisKelamin} onChange = {(e) => setJenisKelamin (e.target.value)} required
                                                    >
                                                        <option></option>
                                                        <option 
                                                        value='Laki laki'
                                                        >Laki - Laki</option>
                                                        <option 
                                                        value='Perempuan'
                                                        >Perempuan</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input jenis latihan */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Jenis Latihan</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <div className="relative w-full">
                                                <div className='bg-darkBlue rounded-lg px-2'>
                                                    <select className='w-full bg-darkBlue focus:outline-none' 
                                                    name={jenisLatihan} value={jenisLatihan} onChange = {(e) => setJenisLatihan (e.target.value)} required
                                                    >
                                                        <option></option>
                                                        <option 
                                                        value='Remaja'
                                                        >Remaja</option>
                                                        <option 
                                                        value='Privat'
                                                        >Privat</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input jenis ukt */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Jenis UKT</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <div className="relative w-full">
                                                <div className='bg-darkBlue rounded-lg px-2'>
                                                    <select className='w-full bg-darkBlue focus:outline-none' 
                                                    name={ukt} value={ukt} onChange = {(e) => setUkt (e.target.value)} required
                                                    >
                                                        <option></option>
                                                        <option 
                                                        value='UKT Jambon'
                                                        >UKT Jambon</option>
                                                        <option 
                                                        value='UKT Hijau'
                                                        >UKT Hijau</option>
                                                        <option 
                                                        value='UKT Putih'
                                                        >UKT Putih</option>
                                                        <option 
                                                        value='UKCW'
                                                        >UKCW</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input event */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Event</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <div className="relative w-full">
                                                <div className='bg-darkBlue rounded-lg px-2'>
                                                    <select className='w-full bg-darkBlue focus:outline-none' 
                                                    name={event} value={event} onChange = {(e) => setEvent (e.target.value)} required
                                                    >
                                                        <option></option>
                                                        {dataEvent.map((item, index) => (
                                                            <option key={index + 1}
                                                            value={item.id_event}
                                                            >{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal footer */}
                                <div className="flex items-center justify-end p-6 space-x-2">
                                    <button onClick={() => setShowModalSiswa(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
                                    {(() => {
                                        if (action === 'insert') {
                                            return (
                                                <button type='submit' className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Tambah</button>
                                            )
                                            } else if (action === 'update') {
                                                return (
                                                <button type='submit' className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Edit</button>
                                            )
                                        }
                                    })()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="bg-black opacity-70 fixed inset-0 z-40"></div>
            </>

        ): null}
        </>
    )
}

export default modal_siswa