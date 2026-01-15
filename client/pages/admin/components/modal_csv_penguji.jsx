import { globalState } from '@/context/context'
import axios from 'axios'
import React, { useContext, useEffect, useState, } from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Modal_CSV_Penguji = () => {

    // state modal
    const { showModalCSV, setShowModalCSV } = useContext(globalState)

    // state
    const [fileCSV, setFileCSV] = useState();

    const handleFile = (e) => {
        e.preventDefault()
        setFileCSV(e.target.files[0])
    }

    // function handle add and edit
    const handleSave = (e) => {
        e.preventDefault()

        const token = localStorage.getItem('token')

        let form = new FormData()
        form.append ('excelFile', fileCSV)

        axios.post(BASE_URL + `penguji/excel`, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setShowModalCSV(false)
                console.log(res.data.message);
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const downloadTemplate = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
            BASE_URL + 'penguji/download/template',
            {
                responseType: 'blob', // IMPORTANT
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Create downloadable link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template_penguji.xlsx');

        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error('Failed to download template:', error);
    }
};

    useEffect(() => {
    }, [fileCSV])

    return (
        <>
            {showModalCSV ? (
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
                                            Tambah Penguji
                                        </h1>
                                        <button onClick={() => setShowModalCSV(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                            <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal body */}
                                    <div className="px-6 py-2 space-y-3">

                                        {/* Input csv */}
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-2/6 flex justify-between">
                                                <span>File</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-4/6">
                                                <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                    type="file"
                                                    onChange={(e) => handleFile(e)}
                                                // required
                                                >
                                                </input>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal footer */}
                                    <div className="flex items-center p-6 space-x-2">
                                        <div className='w-1/2 '>
                                            <button 
                                            type='button'
                                            onClick={downloadTemplate} className="text-green hover:text-white bg-white hover:bg-green duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Template</button>
                                        </div>
                                        <div className='w-1/2 flex justify-end space-x-2'>
                                            <button onClick={() => setShowModalCSV(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
                                            <button type='submit' className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Tambah</button>
                                        </div>
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

export default Modal_CSV_Penguji