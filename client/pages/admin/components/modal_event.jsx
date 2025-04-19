import { globalState } from '@/context/context'
import axios from 'axios'
import React, { useContext, useState, } from 'react'
import dynamic from 'next/dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Select = dynamic(() => import('react-select'));


const customStyles = {
    control: (provided) => ({
        ...provided,
        background: 'white',
        colors: 'black',
        // display: 'flex',
        // flexWrap: 'nowrap',
        // borderColor: 'hsl(0deg 78.56% 55.56%);',
        // width: '7em'
    }),
    menu: (provided) => ({
        ...provided,
        background: 'white',
        color: 'grey', // Set text color to black
        width: '8rem'
    }),
};

const modal_event = () => {

    // state modal
    const { showModalEvent, setShowModalEvent } = useContext(globalState)

    // state
    const [rantingOption, setRantingOption] = useState()

    const { setDataEvent, action, idEvent } = useContext(globalState)
    const { name, setName } = useContext(globalState)
    const { date, setDate } = useContext(globalState)
    const { tipe, setTipe } = useContext(globalState)
    const { ranting, setRanting } = useContext(globalState)
    const { isActive, setIsActive } = useContext(globalState)

    //ranting
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

    const handleChangeRanting = (option) => {

        setRantingOption(option)
        setRanting(option.value)
    };

    // function get data event
    const getDataEvent = () => {
        const token = localStorage.getItem('token')
        axios.get(BASE_URL + `event/ukt/${tipe}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataEvent(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function handle add and edit
    const handleSave = (e) => {
        e.preventDefault()

        const token = localStorage.getItem('token')

        let form = {
            name: name,
            tanggal: date,
            id_ranting: ranting,
            tipe_ukt: tipe,
            is_active: isActive
        }

        if (action === 'insert') {
            axios.post(BASE_URL + `event`, form, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    setShowModalEvent(false)
                    getDataEvent()
                    console.log(res.data.message);
                })
                .catch(err => {
                    console.log(err.message);
                })
        } else if (action === 'update') {
            axios.put(BASE_URL + `event/${idEvent}`, form, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    setShowModalEvent(false)
                    getDataEvent()
                    console.log(res.data.message);
                })
                .catch(err => {
                    console.log(err.message);
                })
        }
    }

    return (
        <>
            {showModalEvent ? (
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
                                                        Tambah Data Event
                                                    </h1>
                                                )
                                            } else if (action === 'update') {
                                                return (
                                                    <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                                        Edit Data Event
                                                    </h1>
                                                )
                                            }
                                        })()}
                                        <button onClick={() => setShowModalEvent(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                            <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal body */}
                                    <div className="px-6 py-2 space-y-3">

                                        {/* Input nama */}
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-2/6 flex justify-between">
                                                <span>Nama</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-4/6">
                                                <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                >
                                                </input>
                                            </div>
                                        </div>

                                        {/* Input tanggal */}
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-2/6 flex justify-between">
                                                <span>Tanggal</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-4/6">
                                                <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2 stroke-white'
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    required
                                                >
                                                </input>
                                            </div>
                                        </div>

                                        {/* Select */}
                                        {tipe === 'UKCW' && <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-2/6 flex justify-between">
                                                <span>Ranting</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-4/6">
                                                <Select
                                                    className='w-72'
                                                    onChange={handleChangeRanting}
                                                    options={dataRanting}
                                                    value={rantingOption}
                                                    styles={customStyles}
                                                />
                                            </div>
                                        </div>}


                                        {/* Input Status */}
                                        <div className="flex flex-row space-x-3 w-full">
                                            <div className="w-2/6 flex justify-between">
                                                <span>{isActive ? 'Aktif' : 'Non Aktif'}</span>
                                                <span>:</span>
                                            </div>
                                            <div className="w-4/6 gap-3">
                                                <button onClick={() => setIsActive(true)} className={`w-1/2 ${isActive ? 'text-white bg-green duration-300' : 'text-green bg-white duration-300'} rounded-l-lg font-medium px-5 py-2.5 focus:z-10`}>Aktifkan</button>
                                                <button onClick={() => setIsActive(false)} className={`w-1/2 ${isActive ? 'text-red bg-white duration-300' : 'text-white bg-red  duration-300'}  font-medium rounded-r-lg px-5 py-2.5 text-center`}>Non Aktfikan</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal footer */}
                                    <div className="flex items-center justify-end p-6 space-x-2">
                                        <button onClick={() => setShowModalEvent(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
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

            ) : null}
        </>
    )
}

export default modal_event