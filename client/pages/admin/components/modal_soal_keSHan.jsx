import { globalState } from '@/context/context'
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'

const modal_soal_keSHan = (props) => {

    // state modal
    const { showModalSoalKeSHan, setShowModalSoalKeSHan } = useContext(globalState)

    return (
        <>
            {showModalSoalKeSHan ? (
                <>
                    {/* Main modal */}
                    <div className="fixed flex justify-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
                        <div className="relative w-full h-full max-w-2xl md:h-auto">

                            {/* Modal content */}
                            <div className="relative bg-navy text-white rounded-lg shadow">

                                {/* Modal header */}
                                <div className="flex justify-center p-4">
                                    <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                        Tambah Soal {props.tipe}
                                    </h1>
                                    <button onClick={() => setShowModalSoalKeSHan(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                        <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                            </path>
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={props.onSave}>
                                    {/* Modal body */}
                                    <div className="px-6 py-2 space-y-3">

                                        {/* Input soal */}
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-1/6 flex justify-between">
                                                <span>Soal</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-5/6">
                                                <textarea className='w-full h-40 bg-darkBlue rounded-md focus:outline-none px-2'
                                                    type="text"
                                                    value={props.pertanyaan}
                                                    onChange={(e) => props.setPertanyaan(e.target.value)}
                                                    required
                                                >
                                                </textarea>
                                            </div>
                                        </div>

                                        {/* Input jawaban */}
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-1/6 flex justify-between">
                                                <span>Jawaban</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-5/6">
                                                <div className="space-y-3">

                                                    {/* wrapper checkbox and answer */}
                                                    <div className="flex items-center gap-x-3">
                                                        <input className='w-6 h-6' type="radio" name="true option" id="" value='opsi1' onChange={(e) => props.setOpsi(e.target.value)} checked={props.opsi === 'opsi1'} />
                                                        <input className='w-full h-6 bg-darkBlue rounded-md focus:outline-none px-2'
                                                            type="text"
                                                            value={props.opsi1}
                                                            onChange={(e) => props.setOpsi1(e.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>

                                                    {/* wrapper checkbox and answer */}
                                                    <div className="flex items-center gap-x-3">
                                                        <input className='w-6 h-6' type="radio" name="true option" id="" value='opsi2' onChange={(e) => props.setOpsi(e.target.value)} />
                                                        <input className='w-full h-6 bg-darkBlue rounded-md focus:outline-none px-2'
                                                            type="text"
                                                            value={props.opsi2}
                                                            onChange={(e) => props.setOpsi2(e.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>

                                                    {/* wrapper checkbox and answer */}
                                                    <div className="flex items-center gap-x-3">
                                                        <input className='w-6 h-6' type="radio" name="true option" id="" value='opsi3' onChange={(e) => props.setOpsi(e.target.value)} />
                                                        <input className='w-full h-6 bg-darkBlue rounded-md focus:outline-none px-2'
                                                            type="text"
                                                            value={props.opsi3}
                                                            onChange={(e) => props.setOpsi3(e.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>

                                                    {/* wrapper checkbox and answer */}
                                                    <div className="flex items-center gap-x-3">
                                                        <input className='w-6 h-6' type="radio" name="true option" id="" value='opsi4' onChange={(e) => props.setOpsi(e.target.value)} />
                                                        <input className='w-full h-6 bg-darkBlue rounded-md focus:outline-none px-2'
                                                            type="text"
                                                            value={props.opsi4}
                                                            onChange={(e) => props.setOpsi4(e.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Modal footer */}
                                    <div className="flex items-center justify-end p-6 space-x-2">
                                        <button onClick={() => setShowModalSoalKeSHan(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center" type='button'>Cancel</button>
                                        <button className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10" type='submit'>Simpan</button>
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

export default modal_soal_keSHan