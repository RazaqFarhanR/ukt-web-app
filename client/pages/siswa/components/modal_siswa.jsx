import React, { useEffect } from 'react'

const modal = (props) => {

    const showModalSiswa = props.show
    const nilai = props.nilai

    return (
        <>
        {showModalSiswa ? (
            <>
                {/* Main modal */}
                <div className="fixed flex justify-center items-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0">
                    <div className="relative w-[90%] h-auto max-w-2xl md:h-auto rounded-lg bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] p-0.5">
                        
                        {/* Modal content */}
                        <div className="relative bg-navy text-white rounded-lg shadow px-10">
                            
                            {/* Modal header */}
                            <div className="flex justify-center p-4">
                                <h1 className="text-2xl font-semibold text-green tracking-wide text-center">
                                    Verifikasi Nama
                                </h1>
                                <button onClick={props.close} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                    <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                        </path>
                                    </svg>  
                                </button>
                            </div>

                            {/* line */}
                            <div className="flex justify-center mb-2">
                                <div className="rounded-lg bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] w-full h-0.5"></div>
                            </div>
                            {/* Modal body */}
                            <div className="py-2 space-y-3">

                                <div className="w-full">
                                    <h1 className='text-center font-lato font-bold text-3xl'>{props.nama}</h1>
                                </div>

                                <div className="w-full">
                                    <h1 className='text-center font-lato font-bold text-xl'>{props.ranting}</h1>
                                </div>

                            </div>

                            {/* Modal footer */}
                            <div className="flex items-center py-2 pb-6">
                                <button className={`font-lato text-white rounded-lg font-lg px-5 py-3 w-full ${nilai > 0 ? 'bg-gray':'bg-purple'}`} onClick={props.mulai} disabled={nilai>0}>MULAI UJI KESHAN</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-black opacity-80 fixed inset-0 z-40"></div>
            </>

        ): null}
        </>
    )
}

export default modal