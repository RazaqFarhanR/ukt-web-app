import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { globalState } from '@/context/context'
import Header from './components/header'
import Modal_Alert from './components/modal_alert';
import { useRouter } from 'next/router';
import SocketIo from 'socket.io-client'
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL
const socket = SocketIo(SOCKET_URL)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;



const jurus_toya = () => {

    const [showModalAlert, setShowModalAlert] = useState(false);
    const router = useRouter()
    // state
    const [alert, setAlert] = useState(false)
    const [dataSiswa, setDataSiswa] = useState([])
    const [selectedButton, setSelectedButton] = useState([])

    const updatedOptions = [...selectedButton];

    // function set selected button
    function handleButtonClick(id_jurus_toya, selectedOption) {
        const index = updatedOptions.findIndex(
            (option) => option.id === id_jurus_toya && option.selectedOption === selectedOption
        );

        const idjurus_toya = updatedOptions.findIndex(
            (option) => option.id === id_jurus_toya
        )

        if (index !== -1) {
            updatedOptions[index].selectedOption = null;
        } else {
            updatedOptions[idjurus_toya].selectedOption = selectedOption
        }

        setSelectedButton(updatedOptions);
    }




    const handleAlertData = (data) => {
        console.log(data.data)
        if (data.data === true) {
            setAlert(true)
        } else if (data.data === false) {
            setShowModalAlert(false)
        }
    }

    useEffect(() => {
        if (alert == true) {
            handleSave()
            setShowModalAlert(false);
        }
    }, [alert])

    // function handle save nilai jurus_toya
    const handleSave = () => {
        setShowModalAlert(true);
        // -- data detail -- //
        const token = localStorage.getItem('tokenPenguji')
        const dataPenguji = JSON.parse(localStorage.getItem('penguji'))
        const data = selectedButton.map((option) => {
            return {
                id_jurus_toya: option.id,
                predikat: option.selectedOption,
            }
        })
        const dataDetail = {
            id_penguji: dataPenguji.id_penguji,
            id_siswa: dataSiswa.id_siswa,
            id_event: dataSiswa.id_event,
            tipe_ukt: dataSiswa.tipe_ukt,
            ujian: data
        }
        if (alert == true) {
            axios.post(BASE_URL + `jurus_toya_detail/exam`, dataDetail, { headers: { Authorization: `Bearer ${token}` } })
                .then(async res => {
                    console.log(res)

                    socket.emit('pushRekap')
                    router.back()
                })
        } else {
            null
        }
    }

    useEffect(() => {
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        setDataSiswa(dataSiswa)
        const dataUKCW = [
            { id: 1, name: "Jurus Toya 1", selectedOption: null },
            { id: 2, name: "Jurus Toya 2", selectedOption: null },
            { id: 3, name: "Jurus Toya 3", selectedOption: null },
            { id: 4, name: "Jurus Toya 4", selectedOption: null },
            { id: 5, name: "Jurus Toya 5", selectedOption: null },
            { id: 6, name: "Jurus Toya 6", selectedOption: null },
            { id: 7, name: "Jurus Toya 7", selectedOption: null },
            { id: 8, name: "Jurus Toya 8", selectedOption: null },
            { id: 9, name: "Jurus Toya 9", selectedOption: null },
            { id: 10, name: "Jurus Toya 10", selectedOption: null },
            { id: 11, name: "Jurus Toya 11", selectedOption: null },
            { id: 12, name: "Jurus Toya 12", selectedOption: null },
            { id: 13, name: "Jurus Toya 13", selectedOption: null },
            { id: 14, name: "Jurus Toya 14", selectedOption: null },
            { id: 15, name: "Jurus Toya 15", selectedOption: null },
        ]
        const dataUktPutih = [
            { id: 1, name: "Jurus Toya 1", selectedOption: null },
            { id: 2, name: "Jurus Toya 2", selectedOption: null },
            { id: 3, name: "Jurus Toya 3", selectedOption: null },
            { id: 4, name: "Jurus Toya 4", selectedOption: null },
            { id: 5, name: "Jurus Toya 5", selectedOption: null },
            { id: 6, name: "Jurus Toya 6", selectedOption: null },
            { id: 7, name: "Jurus Toya 7", selectedOption: null },
            { id: 8, name: "Jurus Toya 8", selectedOption: null },
        ]
        const shuffleArray = (arr) => {
            return [...arr].sort(() => Math.random() - 0.5)
        }

        const data =
            dataSiswa.tipe_ukt === "UKCW"
                ? shuffleArray(dataUKCW).slice(0, 8)
                : shuffleArray(dataUktPutih).slice(0, 4)

        setSelectedButton(data)
    }, [])
    return (
        <>
            <div className="font-lato">

                {/* awal wrapper konten utama */}
                <div className="w-full h-screen">

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-5 py-8">

                        {/* card siswa information */}
                        <div className="bg-navy rounded-md p-3 text-white mb-8 shadow shadow-slate-700 hover:shadow-purple transition ease-in-out duration-300">
                            <h1 className='text-green tracking-wide text-lg'>{dataSiswa.nomor_urut}</h1>
                            <h1 className='text-xl font-semibold'>{dataSiswa.name}</h1>
                            <h1 className='tracking-wide'>{dataSiswa.id_ranting}</h1>
                        </div>

                        {/* jurus_toya list */}
                        <div className="space-y-3 mb-10">
                            {selectedButton?.map((item, index) => (
                                <div key={index + 1} className="grid grid-cols-2 items-center">
                                    <h1 className='text-white text-xl font-semibold uppercase'>{item.name}</h1>
                                    <div className="gap-x-2 grid grid-flow-col grid-cols-10 text-sm mb:text-md">
                                        <button className='col-span-4'>
                                            <div className="hover:scale-105 transition ease-in-out duration-500 
                                            hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                                <button className={selectedButton.find(
                                                    (option) =>
                                                        option.id === item.id &&
                                                        option.selectedOption == 0
                                                ) ? "font-semibold bg-red rounded-md text-white py-1.5 w-full uppercase"
                                                    : "font-semibold bg-navy border-2 border-red rounded-md text-white py-1.5 w-full uppercase"}
                                                    onClick={() => handleButtonClick(item.id, 0)
                                                    }
                                                >SALAH</button>
                                            </div>
                                        </button>

                                        <button className='col-span-4'>
                                            <div className="hover:scale-105 transition ease-in-out duration-500 
                                            hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                                <button className={selectedButton.find(
                                                    (option) =>
                                                        option.id === item.id &&
                                                        option.selectedOption >= 1
                                                ) ? "font-semibold bg-purple rounded-md text-white py-1.5 w-full uppercase"
                                                    : "font-semibold bg-navy border-2 border-purple rounded-md text-white py-1.5 w-full uppercase"}
                                                    onClick={() => handleButtonClick(item.id, 1)}>BENAR {item.id}</button>
                                            </div>
                                        </button>

                                        <button className='col-span-3'>
                                            <div className="hover:scale-105 transition ease-in-out duration-500 
                                            hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                                <button className={selectedButton.find(
                                                    (option) =>
                                                        option.id === item.id &&
                                                        option.selectedOption === 2
                                                ) ? "font-semibold bg-green rounded-md text-white py-1.5 w-full uppercase"
                                                    : "font-semibold bg-navy border-2 border-green rounded-md text-white py-1.5 w-full uppercase"}
                                                    onClick={() => handleButtonClick(item.id, 2)}>+</button>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='bg-yellow hover:bg-white rounded-md p-3 text-center text-xl text-white 
                        hover:text-yellow font-semibold shadow shadow-slate-700 duration-300 uppercase' onClick={() => handleSave()}>Selesai</div>
                    </div>
                </div>
            </div>

            <globalState.Provider value={{ showModalAlert, setShowModalAlert }}>
                <Modal_Alert onData={handleAlertData} />
            </globalState.Provider>
        </>
    )
}

export default jurus_toya