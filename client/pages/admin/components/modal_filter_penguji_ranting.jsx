import { globalState } from '@/context/context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ModalFilterPengujiRanting = (props) => {

    //  state Modal  // 

    const { modalFilter, setModalFilter } = useContext(globalState);
    const { dataRanting, setDataRanting } = useContext(globalState)
    const { jenis, setJenis } = useContext(globalState)
    const { updown, setUpDown } = useContext(globalState)
    const [upDownFilter, setUpDownFilter] = useState(null)
    const [selectedButton, SetSelectedButton] = useState([]);
    const [selectedAllButton, setSelectedAllButton] = useState (false)

    const updatedOptions = [...selectedButton];

    function handleButtonClick(id_ranting, selectedOption) {
        const index = updatedOptions.findIndex(
            (option) => option.id_ranting === id_ranting
        );
        if (index === -1) {
            updatedOptions.push({ id_ranting, selectedOption });
        } else {
            updatedOptions[index].selectedOption = selectedOption;
        }
        SetSelectedButton(updatedOptions);
    }

    // function get data ranting
    const getData = () => {  
        const dataEvent = JSON.parse(localStorage.getItem('event'))
        const token = localStorage.getItem('token')
        let IdEvent = (dataEvent.id_event)
        axios.get(BASE_URL + `ranting`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                // console.log(res)
                // console.log(res.data.data[0])
                for (let i = 0; i < res.data.count; i++) {
                    const id_ranting = res.data.data[i].id_ranting
                    const selectedOption = null
                    handleButtonClick(id_ranting, selectedOption)
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const handleCheckAllButton = () => {
        for (let i = 0; i < selectedButton.length; i++) {
            const id_ranting = selectedButton[i].id_ranting
            const selectedOption = 'checked'
            handleButtonClick(id_ranting, selectedOption)
        }
        if (selectedAllButton == true) {
            setSelectedAllButton (false)
        } else {
            setSelectedAllButton (true)
        }
    }
    const handleBlankAllButton = () => {
        for (let i = 0; i < selectedButton.length; i++) {
            const id_ranting = selectedButton[i].id_ranting
            const selectedOption = null
            handleButtonClick(id_ranting, selectedOption)
        }
        if (selectedAllButton == true) {
            setSelectedAllButton (false)
        } else {
            setSelectedAllButton (true)
        }
    }
    // function go to page sambung
    const handleFilter = () => {
        let idRanting = []
        for (let i = 0; i < selectedButton.length; i++) {
            if (selectedButton[i].selectedOption == 'checked') {
                idRanting.push(selectedButton[i].id_ranting)
            }
            if (i + 1 == selectedButton.length) {
                localStorage.setItem('filterPengujiRanting', JSON.stringify(idRanting))
                setDataRanting(idRanting);
                setModalFilter(false)
            }
        }
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
    }, [selectedButton])

    return (
        <>
            {modalFilter ? (
                <>
                    Main modal
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-0">
                        <div className="bg-transparent rounded-lg max-w-md mx-auto p-2">

                            {/* Modal content */}
                            <div className="relative bg-navy text-white rounded-lg shadow">

                                {/* Modal header */}
                                <div className="flex justify-center items-center p-4 bg-darkBlue shadow-lg  drop-shadow-md">
                                    <h1 className='text-xl font-semibold text-white tracking-wider'>Filter Siswa</h1>
                                    <button onClick={() => setModalFilter(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5 hover:scale-125 transition-all duration-300">
                                        <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                            </path>
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal body */}
                                <div className="flex justify-center ">

                                    {/* wrapper button filter */}
                                    <div className="md:px-5 py-2 space-y-3 w-full">

                                        <div className="flex items-center gap-x-2 border-b-2 border-purple py-2">
                                            { selectedAllButton
                                            ? <button onClick={() => handleBlankAllButton()} className="bg-purple rounded-md w-5 h-5"></button>
                                            : <button onClick={() => handleCheckAllButton()} className="bg-white rounded-md w-5 h-5"></button>
                                            }
                                            <h1 className='text-white text-lg tracking-wider'>Select All</h1>
                                        </div>

                                        {/* button filter a to z */}
                                        {/* <button
                                            onClick={() => setUpDownFilter('upToDown')}
                                            className="w-1/2 px-1">
                                            <div className={
                                                upDownFilter == 'upToDown'
                                                    ? 'bg-purple text-white border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300'
                                                    : 'bg-navy text-purple border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300'
                                            }>
                                                <h1>A - Z</h1>
                                            </div>
                                        </button> */}

                                        {/* button filter z to a */}
                                        {/* <button
                                            onClick={() => setUpDownFilter('downToUp')}
                                            className="w-1/2 px-1">
                                            <div className={
                                                upDownFilter == 'downToUp'
                                                    ? 'bg-purple text-white border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300'
                                                    : 'bg-navy text-purple border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300'
                                            }>
                                                <h1>Z - A</h1>
                                            </div>
                                        </button> */}

                                        {/* button filter all */}
                                        {/* <button
                                            onClick={() => handleCheckAllButton()}
                                            className="w-1/2 px-1">
                                            <div className='bg-green text-white border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300'>
                                                <h1>ALL</h1>
                                            </div>
                                        </button> */}

                                        {/* button filter blanks */}
                                        {/* <button
                                            onClick={() => handleBlankAllButton()}
                                            className="w-1/2 px-1">
                                            <div className='bg-red text-white border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300'>
                                                <h1>BLANKS</h1>
                                            </div>
                                        </button> */}

                                        {/* wrapper ranting button */}
                                        <div className="grid grid-cols-2 gap-x-3">
                                            {selectedButton.map((item, index) => (
                                                <button key={index + 1} className="px-1" onClick={() => handleButtonClick(item.id_ranting, item.selectedOption == null ? 'checked' : null)}>
                                                    <div className={
                                                        item.selectedOption
                                                            ? "bg-purple text-white border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300"
                                                            : "bg-navy text-white border-purple border-2 rounded-md md:p-3 p-2  mb-3 shadow shadow-slate-700  hover:shadow-purple hover:scale-105 transition ease-in-out duration-300"
                                                    }>
                                                        <p className="md:text-md text-xs">{item.id_ranting}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal footer */}
                                <div className="flex items-center justify-end p-6 space-x-2">
                                    <button onClick={() => setModalFilter(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
                                    <button onClick={() => handleFilter()} className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Selesai</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black opacity-70 fixed inset-0 z-40"></div>
                </>

            ) : null}
        </>
    )
}

export default ModalFilterPengujiRanting