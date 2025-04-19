import React, { useContext } from 'react'
import { globalState } from '@/context/context'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const modal_ukt_fisik = () => {

    // state modal
    const { showModalUktFisik, setShowModalUktFisik } = useContext(globalState)

    // state
    const { ukt, action, setDataStandartFisik } = useContext(globalState)

    // state mft
    const { mft_remaja_laki_laki, set_mft_remaja_laki_laki } = useContext(globalState)
    const { mft_remaja_perempuan, set_mft_remaja_perempuan } = useContext(globalState)
    const { mft_privat_laki_laki, set_mft_privat_laki_laki } = useContext(globalState)
    const { mft_privat_perempuan, set_mft_privat_perempuan } = useContext(globalState)

    // state push up
    const { push_up_remaja_laki_laki, set_push_up_remaja_laki_laki } = useContext(globalState)
    const { push_up_remaja_perempuan, set_push_up_remaja_perempuan } = useContext(globalState)
    const { push_up_privat_laki_laki, set_push_up_privat_laki_laki } = useContext(globalState)
    const { push_up_privat_perempuan, set_push_up_privat_perempuan } = useContext(globalState)

    // state spir perut atas
    const { spir_perut_atas_remaja_laki_laki, set_spir_perut_atas_remaja_laki_laki } = useContext(globalState)
    const { spir_perut_atas_remaja_perempuan, set_spir_perut_atas_remaja_perempuan } = useContext(globalState)
    const { spir_perut_atas_privat_laki_laki, set_spir_perut_atas_privat_laki_laki } = useContext(globalState)
    const { spir_perut_atas_privat_perempuan, set_spir_perut_atas_privat_perempuan } = useContext(globalState)

    // state spir perut bawah
    const { spir_perut_bawah_remaja_laki_laki, set_spir_perut_bawah_remaja_laki_laki } = useContext(globalState)
    const { spir_perut_bawah_remaja_perempuan, set_spir_perut_bawah_remaja_perempuan } = useContext(globalState)
    const { spir_perut_bawah_privat_laki_laki, set_spir_perut_bawah_privat_laki_laki } = useContext(globalState)
    const { spir_perut_bawah_privat_perempuan, set_spir_perut_bawah_privat_perempuan } = useContext(globalState)

    // state spir dada
    const { spir_dada_remaja_laki_laki, set_spir_dada_remaja_laki_laki } = useContext(globalState)
    const { spir_dada_remaja_perempuan, set_spir_dada_remaja_perempuan } = useContext(globalState)
    const { spir_dada_privat_laki_laki, set_spir_dada_privat_laki_laki } = useContext(globalState)
    const { spir_dada_privat_perempuan, set_spir_dada_privat_perempuan } = useContext(globalState)

    // state spir dada
    const { spir_paha_remaja_laki_laki, set_spir_paha_remaja_laki_laki } = useContext(globalState)
    const { spir_paha_remaja_perempuan, set_spir_paha_remaja_perempuan } = useContext(globalState)
    const { spir_paha_privat_laki_laki, set_spir_paha_privat_laki_laki } = useContext(globalState)
    const { spir_paha_privat_perempuan, set_spir_paha_privat_perempuan } = useContext(globalState)
    // state plank
    const { plank_remaja_laki_laki, set_plank_remaja_laki_laki } = useContext(globalState)
    const { plank_remaja_perempuan, set_plank_remaja_perempuan } = useContext(globalState)
    const { plank_privat_laki_laki, set_plank_privat_laki_laki } = useContext(globalState)
    const { plank_privat_perempuan, set_plank_privat_perempuan } = useContext(globalState)

    // function get data fisik by ukt
    const getDataStandartFisik = () => {
        const token = localStorage.getItem('tokenPenguji')

        axios.get(BASE_URL + `standar_fisik/jenis_latihan/${ukt}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataStandartFisik(res.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function handle edit fisik
    const handleSave = (e) => {
        e.preventDefault()

        let token = localStorage.getItem('tokenPenguji')

        let form = {

            // mft
            'mft_remaja_laki': mft_remaja_laki_laki,
            'mft_remaja_perempuan': mft_remaja_perempuan,
            'mft_privat_laki': mft_privat_laki_laki,
            'mft_privat_perempuan': mft_privat_perempuan,

            // push up
            'push_up_remaja_laki': push_up_remaja_laki_laki,
            'push_up_remaja_perempuan': push_up_remaja_perempuan,
            'push_up_privat_laki': push_up_privat_laki_laki,
            'push_up_privat_perempuan': push_up_privat_perempuan,

            // spir perut atas
            'spir_perut_atas_remaja_laki': spir_perut_atas_remaja_laki_laki,
            'spir_perut_atas_remaja_perempuan': spir_perut_atas_remaja_perempuan,
            'spir_perut_atas_privat_laki': spir_perut_atas_privat_laki_laki,
            'spir_perut_atas_privat_perempuan': spir_perut_atas_privat_perempuan,

            // spir perut bawah
            'spir_perut_bawah_remaja_laki': spir_perut_bawah_remaja_laki_laki,
            'spir_perut_bawah_remaja_perempuan': spir_perut_bawah_remaja_perempuan,
            'spir_perut_bawah_privat_laki': spir_perut_bawah_privat_laki_laki,
            'spir_perut_bawah_privat_perempuan': spir_perut_bawah_privat_perempuan,

            // spir dada
            'spir_dada_remaja_laki': spir_dada_remaja_laki_laki,
            'spir_dada_remaja_perempuan': spir_dada_remaja_perempuan,
            'spir_dada_privat_laki': spir_dada_privat_laki_laki,
            'spir_dada_privat_perempuan': spir_dada_privat_perempuan,
            
            // spir paha
            'spir_paha_remaja_laki': spir_paha_remaja_laki_laki,
            'spir_paha_remaja_perempuan': spir_paha_remaja_perempuan,
            'spir_paha_privat_laki': spir_paha_privat_laki_laki,
            'spir_paha_privat_perempuan': spir_paha_privat_perempuan,

            // plank
            'plank_remaja_laki': plank_remaja_laki_laki,
            'plank_remaja_perempuan': plank_remaja_perempuan,
            'plank_privat_laki': plank_privat_laki_laki,
            'plank_privat_perempuan': plank_privat_perempuan,
        }

        axios.put(BASE_URL + `standar_fisik/${action}/${ukt}`, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setShowModalUktFisik(false)
                getDataStandartFisik()
                console.log(res.data.message);
                console.log(res);
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    return (
        <>
            {showModalUktFisik ? (
                <>
                    {/* Main modal */}
                    <div className="fixed flex justify-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
                        <div className="relative w-full h-full max-w-2xl md:h-auto">

                            {/* Modal content */}
                            <div className="relative bg-navy text-white rounded-lg shadow">

                                <form action="POST" onSubmit={handleSave}>

                                    {/* Modal header */}
                                    <div className="flex justify-center p-4">
                                        <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                            Edit Data Fisik
                                        </h1>
                                        <button onClick={() => setShowModalUktFisik(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                            <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal body */}
                                    {(() => {
                                        if (action === 'mft') {
                                            return (
                                                <div className="px-6 py-2 space-y-3">

                                                    {/* input remaja laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input
                                                                type="number"
                                                                value={mft_remaja_laki_laki}
                                                                onChange={(e) => set_mft_remaja_laki_laki(parseFloat(e.target.value))}
                                                                step="0.1"
                                                                min="0"
                                                                max="100"
                                                                className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* input remaja perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input
                                                                type="number"
                                                                value={mft_remaja_perempuan}
                                                                onChange={(e) => set_mft_remaja_perempuan(parseFloat(e.target.value))}
                                                                step="0.1"
                                                                min="0"
                                                                max="100"
                                                                className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* input private laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input
                                                                type="number"
                                                                value={mft_privat_laki_laki}
                                                                onChange={(e) => set_mft_privat_laki_laki(parseFloat(e.target.value))}
                                                                step="0.1"
                                                                min="0"
                                                                max="100"
                                                                className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* input private perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input
                                                                type="number"
                                                                value={mft_privat_perempuan}
                                                                onChange={(e) => set_mft_privat_perempuan(parseFloat(e.target.value))}
                                                                step="0.1"
                                                                min="0"
                                                                max="100"
                                                                className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (action === 'push_up') {
                                            return (
                                                <div className="px-6 py-2 space-y-3">

                                                    {/* input remaja laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={push_up_remaja_laki_laki}
                                                                onChange={(e) => set_push_up_remaja_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input remaja perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={push_up_remaja_perempuan}
                                                                onChange={(e) => set_push_up_remaja_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={push_up_privat_laki_laki}
                                                                onChange={(e) => set_push_up_privat_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={push_up_privat_perempuan}
                                                                onChange={(e) => set_push_up_privat_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (action === 'spir_perut_atas') {
                                            return (
                                                <div className="px-6 py-2 space-y-3">

                                                    {/* input remaja laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_atas_remaja_laki_laki}
                                                                onChange={(e) => set_spir_perut_atas_remaja_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input remaja perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_atas_remaja_perempuan}
                                                                onChange={(e) => set_spir_perut_atas_remaja_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_atas_privat_laki_laki}
                                                                onChange={(e) => set_spir_perut_atas_privat_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_atas_privat_perempuan}
                                                                onChange={(e) => set_spir_perut_atas_privat_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (action === 'spir_perut_bawah') {
                                            return (
                                                <div className="px-6 py-2 space-y-3">

                                                    {/* input remaja laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_bawah_remaja_laki_laki}
                                                                onChange={(e) => set_spir_perut_bawah_remaja_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input remaja perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_bawah_remaja_perempuan}
                                                                onChange={(e) => set_spir_perut_bawah_remaja_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_bawah_privat_laki_laki}
                                                                onChange={(e) => set_spir_perut_bawah_privat_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_perut_bawah_privat_perempuan}
                                                                onChange={(e) => set_spir_perut_bawah_privat_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (action === 'spir_dada') {
                                            return (
                                                <div className="px-6 py-2 space-y-3">

                                                    {/* input remaja laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_dada_remaja_laki_laki}
                                                                onChange={(e) => set_spir_dada_remaja_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input remaja perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_dada_remaja_perempuan}
                                                                onChange={(e) => set_spir_dada_remaja_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_dada_privat_laki_laki}
                                                                onChange={(e) => set_spir_dada_privat_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_dada_privat_perempuan}
                                                                onChange={(e) => set_spir_dada_privat_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (action === 'spir_paha') {
                                            return (
                                                <div className="px-6 py-2 space-y-3">

                                                    {/* input remaja laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_paha_remaja_laki_laki}
                                                                onChange={(e) => set_spir_paha_remaja_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input remaja perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_paha_remaja_perempuan}
                                                                onChange={(e) => set_spir_paha_remaja_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_paha_privat_laki_laki}
                                                                onChange={(e) => set_spir_paha_privat_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={spir_paha_privat_perempuan}
                                                                onChange={(e) => set_spir_paha_privat_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (action === 'plank') {
                                            return (
                                                <div className="px-6 py-2 space-y-3">

                                                    {/* input remaja laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={plank_remaja_laki_laki}
                                                                onChange={(e) => set_plank_remaja_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input remaja perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Remaja - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={plank_remaja_perempuan}
                                                                onChange={(e) => set_plank_remaja_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private laki laki */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Laki Laki</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={plank_privat_laki_laki}
                                                                onChange={(e) => set_plank_privat_laki_laki(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>

                                                    {/* input private perempuan */}
                                                    <div className="flex flex-row space-x-3 w-full">
                                                        <div className="w-2/6 flex justify-between">
                                                            <span>Private - Perempuan</span>
                                                            <span>:</span>
                                                        </div>
                                                        <div className="w-4/6">
                                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                                type="number"
                                                                value={plank_privat_perempuan}
                                                                onChange={(e) => set_plank_privat_perempuan(e.target.value)}
                                                                required
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })()}

                                    {/* Modal footer */}
                                    <div className="flex items-center justify-end p-6 space-x-2">
                                        <button onClick={() => setShowModalUktFisik(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
                                        <button type='submit' className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Edit</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                    <div className="bg-black opacity-70 fixed inset-0 z-40"></div>
                </>

            ) : null}
        </>
    )
}

export default modal_ukt_fisik