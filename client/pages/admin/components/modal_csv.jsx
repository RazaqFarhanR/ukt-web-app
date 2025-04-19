import { globalState } from '@/context/context'
import axios from 'axios'
import React, { useContext, useEffect, useState, } from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Modal_CSV = () => {

    // state modal
    const { showModalCSV, setShowModalCSV } = useContext(globalState)

    // state
    const [dataEvent, setDataEvent] = useState([])
    const [event, setEvent] = useState({ id: 0, name: '', tipe_ukt: '' });
    const [name, setName] = useState();
    const [tipeUKT, setTipeUKT] = useState();
    const [fileCSV, setFileCSV] = useState();

    // function get data CSV
    const getDataCSV = () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('admin')
        const dataUser = JSON.parse(user)
        axios.get(BASE_URL + `event`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                console.log(dataUser)
                const data = res.data.data
                if(dataUser.id_role == 'admin ranting'){
                    setDataEvent(data.filter(item => item.tipe_ukt !== 'UKCW' && item.is_active === true))
                } else {
                    setDataEvent(data.filter(item => item.is_active === true))
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const handleFile = (e) => {
        e.preventDefault()
        setFileCSV(e.target.files[0])
    }

    useEffect(() => {
        getDataCSV();
    }, [])

    // function handle add and edit
    const handleSave = (e) => {
        e.preventDefault()

        const token = localStorage.getItem('token')

        let form = new FormData()
        form.append ('csvFile', fileCSV)
        form.append ('id_event', event.id)
        form.append ('tipe_ukt', event.tipe_ukt)
        // let form = {
        //     csvFile: fileCSV,
        //     id_event: event.id,
        //     tipe_ukt: event.tipe_ukt
        // }

        axios.post(BASE_URL + `siswa/csv`, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setShowModalCSV(false)
                console.log(res.data.message);
            })
            .catch(err => {
                console.log(err.message);
            })
    }

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
                                            Tambah Siswa by CSV
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
                                                <span>csv</span>
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

                                        {/* Input nama */}
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-2/6 flex justify-between">
                                                <span>Event</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-4/6">
                                                <div className="relative w-full">
                                                    <div className='bg-darkBlue rounded-lg px-2'>
                                                        {/* <select className='w-full bg-darkBlue focus:outline-none'
                                                            name={idEvent} value={idEvent} onChange={(e) => setJenisKelamin(e.target.value)} required
                                                        >
                                                            <option></option>
                                                            <option
                                                                value='Laki laki'
                                                            >Laki - Laki</option>
                                                            <option
                                                                value='Perempuan'
                                                            >Perempuan</option>
                                                        </select> */}
                                                        <select
                                                            className="w-full bg-darkBlue focus:outline-none"
                                                            onChange={(e) => {
                                                                const data = JSON.parse(e.target.value);
                                                                setEvent({ id: data.id, name: data.name, tipe_ukt: data.tipe_ukt })
                                                            }}
                                                        >
                                                            <option value="" disabled>Select an option</option>
                                                            {dataEvent.map((item, index) => (
                                                                <option key={index} value={JSON.stringify({ id: item.id_event, name: item.name, tipe_ukt: item.tipe_ukt })}>{item.tipe_ukt} : {item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal footer */}
                                    <div className="flex items-center justify-end p-6 space-x-2">
                                        <button onClick={() => setShowModalCSV(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
                                        <button type='submit' className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Tambah</button>
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

export default Modal_CSV