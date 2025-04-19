import React from 'react'

const ModalSelesai = (props) => {
    const showModalSiswa = props.show

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
                            <div className="flex justify-center py-10 gap-y-4 w-full">
                                <div>
                                    <h1 className="text-7xl font-semibold text-[#ff5959] tracking-wide text-center uppercase">
                                        Waktu Habis
                                    </h1>
                                    <h1 className="text-4xl font-semibold text-green tracking-wide text-center uppercase">
                                        Jawaban Berhasil Disimpan
                                    </h1>
                                </div>
                            </div>

                            {/* line */}
                            {/* <div className="flex justify-center mb-2"> */}
                                {/* <div className="rounded-lg bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] w-full h-0.5"></div> */}
                            {/* </div> */}
                            {/* Modal body */}
                            {/* <div className="py-2 space-y-3">
                            </div> */}

                            {/* Modal footer */}
                            <div className="flex items-center py-2 pb-6">
                                <button className="font-lato text-white bg-purple rounded-lg text-2xl font-bold px-5 py-2 w-full uppercase" onClick={props.logout}>Selesai</button>
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

export default ModalSelesai