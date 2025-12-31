import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { globalState } from '@/context/context'
import Header from './components/header'
import Modal_Alert from './components/modal_alert';
import { useRouter } from 'next/router'
import { getSocket } from '../../lib/socket';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const jurus = () => {

    const [showModalAlert, setShowModalAlert] = useState(false);
    const router = useRouter()
    // state
    const [alert, setAlert] = useState(false)
    const [dataSiswa, setDataSiswa] = useState([])
    const [dataJurus, setDataJurus] = useState([])
    const [selectedButton, setSelectedButton] = useState([])

    // function get data siswa
    const getDataSiswa = () => {
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        setDataSiswa(dataSiswa)
    }

    const updatedOptions = [...selectedButton]

    const handleAlertData = (data) => {
        console.log(data.data)
        if (data.data === true) {
            setAlert(true)
        }
    }

    useEffect(() => {
        if (alert == true) {
            handleSave()
            setShowModalAlert(false);
        }
    }, [alert])

    // function get data jurus
    const getDataJurus = () => {
        const token = localStorage.getItem('tokenPenguji')
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))

        axios.get(BASE_URL + `jurus/ukt/${dataSiswa.tipe_ukt}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataJurus(res.data.data)
                const data = res.data.data
                console.log(res);
                for (let i = 0; i < res.data.data.length; i++) {
                    const id_jurus = data[i].id_jurus
                    const selectedOption = null
                    updatedOptions.push({ id_jurus, selectedOption })
                    setSelectedButton(updatedOptions)
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function set selected button
    function handleButtonClick(id_jurus, selectedOption) {
        const index = updatedOptions.findIndex(
            (option) => option.id_jurus === id_jurus && option.selectedOption === selectedOption
        );
        const idJurus = updatedOptions.findIndex(
            (option) => option.id_jurus === id_jurus
        )
        if (index !== -1) {
            updatedOptions[index].selectedOption = null;
        } else {
            updatedOptions[idJurus].selectedOption = selectedOption
        }

        setSelectedButton(updatedOptions);
    }

     // function handle save nilai jurus
    const handleSave = () => {
        const socket = getSocket();

        setShowModalAlert(true);
        // -- data detail -- //
        const token = localStorage.getItem('tokenPenguji')
        const dataPenguji = JSON.parse(localStorage.getItem('penguji'))
        const data = selectedButton.map((option) => {
            return {
                id_jurus: option.id_jurus,
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
            axios.post(BASE_URL + `jurus_detail/exam`, dataDetail, { headers: { Authorization: `Bearer ${token}` } })
                .then(async res => {

                    socket.emit('submit_nilai', {
                                event_id: dataSiswa.id_event
                            });
                    router.back()
                })
        } else {
            null
        }
    }

    useEffect(() => {
        getDataSiswa()
        getDataJurus()
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))

        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
            socket.emit('join_event', {
            role: 'penguji',
            event_id: dataSiswa.id_event,
            });
        }
    
        return () => {
            socket.disconnect();
        };
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

                        {/* jurus list */}
                        <div className="space-y-3 mb-10">
                            {dataJurus.map((item, index) => (
                                <div key={index + 1} className="grid grid-cols-2 items-center">
                                    <h1 className='text-white text-xl font-semibold'>{item.name}</h1>
                                    <div className="gap-x-2 grid grid-flow-col grid-cols-10 text-sm mb:text-md">
                                        <button className='col-span-4'>
                                            <div className="hover:scale-105 transition ease-in-out duration-500 
                                            hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                                <button className={selectedButton.find(
                                                    (option) =>
                                                        option.id_jurus === item.id_jurus &&
                                                        option.selectedOption === 0
                                                ) ? "font-semibold bg-red rounded-md text-white py-1.5 w-full uppercase"
                                                    : "font-semibold bg-navy border-2 border-red rounded-md text-white py-1.5 w-full uppercase"}
                                                    onClick={() => handleButtonClick(item.id_jurus, 0)
                                                    }
                                                >SALAH</button>
                                            </div>
                                        </button>

                                        <button className='col-span-4'>
                                            <div className="hover:scale-105 transition ease-in-out duration-500 
                                            hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                                <button className={selectedButton.find(
                                                    (option) =>
                                                        option.id_jurus === item.id_jurus &&
                                                        option.selectedOption >= 1
                                                ) ? "font-semibold bg-purple rounded-md text-white py-1.5 w-full uppercase"
                                                    : "font-semibold bg-navy border-2 border-purple rounded-md text-white py-1.5 w-full uppercase"}
                                                    onClick={() => handleButtonClick(item.id_jurus, 1)}>BENAR</button>
                                            </div>
                                        </button>

                                        <button className='col-span-3'>
                                            <div className="hover:scale-105 transition ease-in-out duration-500 
                                            hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 mb-4">
                                                <button className={selectedButton.find(
                                                    (option) =>
                                                        option.id_jurus === item.id_jurus &&
                                                        option.selectedOption === 2
                                                ) ? "font-semibold bg-green rounded-md text-white py-1.5 w-full uppercase"
                                                    : "font-semibold bg-navy border-2 border-green rounded-md text-white py-1.5 w-full uppercase"}
                                                    onClick={() => handleButtonClick(item.id_jurus, 2)}>+</button>
                                            </div>
                                        </button>


                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='bg-yellow hover:bg-white rounded-md p-3 text-center text-xl text-white hover:text-yellow font-semibold shadow shadow-slate-700 duration-300 uppercase' onClick={() => handleSave()}>Selesai</div>
                    </div>
                </div>
            </div>

            <globalState.Provider value={{ showModalAlert, setShowModalAlert }}>
                <Modal_Alert onData={handleAlertData} />
            </globalState.Provider>
        </>
    )
}

export default jurus