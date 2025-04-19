import { globalState } from '@/context/context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Modal_Alert = (props) => {

    //  state Modal  // 
    const { showModalAlert, setShowModalAlert } = useContext(globalState);


    // function go to page sambung
    const goToNilai = (item) => {
        props.onData(item)
    }

    return (
        <>
            {showModalAlert ? (
                <>
                    {/* Main modal */}
                    <div className="fixed flex justify-center items-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0">
                        <div className="relative w-[90%] h-auto max-w-2xl md:h-auto rounded-lg bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] p-0.5">
                            
                            {/* Modal content */}
                            <div className="relative bg-navy text-white rounded-lg shadow px-10">
                                
                                {/* Modal header */}
                                <div className="flex justify-center p-4">
                                    {/* <h1 className="text-2xl font-semibold text-green tracking-wide text-center">
                                        Verifikasi Nama
                                    </h1> */}
                                </div>

                                {/* Modal body */}
                                <div className="py-2 space-y-3">
    
                                    {/* Input nama */}
                                    <div className="w-full">
                                        <h1 className='text-center font-lato text-3xl font-bold text-[#ff5959]'>Apakah Anda Yakin</h1>
                                    </div>
    
                                    {/* Input nama */}
                                    <div className="w-full">
                                        <h1 className='text-center font-lato text-xl '> Menyimpan Data Ini?</h1>
                                    </div>
    
                                </div>
    
                                {/* Modal footer */}

                                <div className="flex items-center py-2 pb-6">
                                    <button className='w-full px-4' onClick={() => setShowModalAlert(false)} key='batal'>
                                        <div className="bg-red rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                            <h1 className='text-xl font-semibold uppercase'>Batal</h1>
                                        </div>
                                    </button>
                                    <button className='w-full px-4' onClick={() => goToNilai({ data: true})} key='simpan'>
                                        <div className="bg-purple rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                            <h1 className='text-xl font-semibold uppercase'>Simpan</h1>
                                        </div>
                                    </button>
                                    {/* <button className="font-lato text-white bg-purple rounded-lg font-lg px-5 py-3 w-full" onClick={props.mulai}>MULAI UJI KESHAN</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black opacity-80 fixed inset-0 z-40"></div>
                </>
            ) : null}
        </>
    )
}

export default Modal_Alert