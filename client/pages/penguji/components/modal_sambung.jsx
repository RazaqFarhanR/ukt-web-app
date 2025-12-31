import { globalState } from '@/context/context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Modal_Filter from './modal_filter';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Modal_Sambung = (props) => {

    //  state Modal  // 
    const [modalFilter, setModalFilter] = useState(false)
    const { showModalSambung, setShowModalSambung } = useContext(globalState);
    const { action, setAction } = useContext(globalState)

    const [dataSiswa, setDataSiswa] = useState([])
    const [dataPenguji, setDataPenguji] = useState([])
    const [dataEvent, setDataEvent] = useState([])
    const [searchName, setSearchName] = useState([])

    // function get data siswa
    const getDataSiswa = () => {
        const dataEvent = JSON.parse(localStorage.getItem('event'))
        const dataPenguji = JSON.parse(localStorage.getItem('penguji'))
        const token = localStorage.getItem('tokenPenguji')
        setDataPenguji(dataPenguji)
        setDataEvent(dataEvent)
        let IdEvent = (dataEvent.id_event)
        console.log("id_event  :" + IdEvent)
        axios.get(BASE_URL + `siswa/event/${IdEvent}/sambung`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataSiswa(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function search siswa by name
    const searchSiswa = () => {
        const token = localStorage.getItem('tokenPenguji')
        axios.get(BASE_URL + `siswa/search/${dataEvent.id_event}/${searchName}/sambung`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                console.log(res);
                setDataSiswa(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const handleChildData = (data) => {
        const token = localStorage.getItem('tokenPenguji')
        if (data) {
            axios.get(BASE_URL + `siswa/ranting/${dataEvent.id_event}/${data.id_ranting}/sambung`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    console.log(res)
                    setDataSiswa(res.data.data)
                })
                .catch(err => {
                    console.log(err.message);
                })
        }
    }

    // function go to page sambung
    const goToNilai = (item) => {
        const token = localStorage.getItem('tokenPenguji')
        const data = {
            tipe_ukt: item.tipe_ukt,
            id_siswa: item.id_siswa,
            id_event: item.id_event,
            rayon: item.rayon
        }
        axios.get(BASE_URL + `ukt_siswa/siswa/${item.id_siswa}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.data.data != null) {
                    localStorage.setItem(`${action}`, JSON.stringify(res.data.data.id_ukt_siswa))
                } else {
                    axios.post(BASE_URL + `ukt_siswa`, data, { headers: { Authorization: `Bearer ${token}` } })
                        .then(res => {
                            localStorage.setItem(`${action}`, JSON.stringify(res.data.data.id_ukt_siswa))
                        })
                }
            })
        if (action === 'posisi1') {
            const data = {
                posisi: 1,
                nomor_urut: item.nomor_urut,
                id_siswa: item.id_siswa,
                name: item.name,
                rayon: item.siswa_ranting.name
            }
            props.onData(data)
            setShowModalSambung(false)
        } else if (action === 'posisi2') {
            const data = {
                posisi: 2,
                nomor_urut: item.nomor_urut,
                id_siswa: item.id_siswa,
                name: item.name,
                rayon: item.siswa_ranting.name
            }
            props.onData(data)
            setShowModalSambung(false)
        }
    }

    useEffect(() => {
        getDataSiswa()
    }, [action])

    useEffect(() => {
        let timeoutId;

        const delayedSearch = () => {
            timeoutId = setTimeout(() => {
                if (!searchName) {
                    getDataSiswa();
                } else {
                    searchSiswa();
                }
            }, 1000); // Adjust the interval time (in milliseconds) as per your requirement
        };

        delayedSearch();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchName]);

    return (
        <>
            {showModalSambung ? (
                <>
                    {/* Main modal */}
                    <div className="absolute overflow-x-hidden flex justify-center top-0 z-50 w-full p-4  md:inset-0">
                        <div className="relative w-full h-full max-w-2xl md:h-auto">

                            {/* Modal content */}
                            <div className="relative bg-navy text-white rounded-lg shadow">

                                <div className="flex justify-center p-4">
                                    <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                        <h1 className='text-xl font-semibold uppercase'>
                                            {action === 'posisi1' ? 'siswa 1' : 'siswa 2'}
                                        </h1>
                                    </div>
                                    <button onClick={() => setShowModalSambung(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                        <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                            </path>
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal header */}
                                <div className='fixed top-0 left-0 w-full z-10 bg-navy border-1 border-white rounded-md'>
                                    <div className="flex justify-center p-4">
                                        <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                            <h1 className='text-xl font-semibold uppercase'>
                                                {action === 'posisi1' ? 'siswa 1' : 'siswa 2'}
                                            </h1>
                                        </div>
                                        <button onClick={() => setShowModalSambung(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                            <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* search */}
                                    <div className="bg-navy py-1.5 px-4 rounded-md h-auto gap-x-2 flex items-center mb-5">
                                        {/* button search */}
                                        <button onClick={() => searchSiswa()}>
                                            <svg width="25" height="25" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M18.3746 18.3751L14.5684 14.5688" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        {/* input search */}
                                        <input className='w-full p-1.5 focus:outline-none text-black' placeholder='Search' type="text" onChange={(e) => setSearchName(e.target.value)} />

                                        {/* filter button */}
                                        <button onClick={() => setModalFilter(true)}>
                                            <svg width="25" height="25" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M25.6667 3.5H2.33337L11.6667 14.5367V22.1667L16.3334 24.5V14.5367L25.6667 3.5Z" stroke="#6464F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>



                                {/* Modal body */}
                                <div className="py-2 space-y-3 mt-12">



                                    {/* card siswa information */}
                                    {(() => {
                                        if (dataPenguji.id_role === 'penguji cabang') {
                                            console.log('penguji cabang');
                                            return (
                                                <>
                                                    {dataSiswa.map((item, index) => (
                                                        <button className='w-full' onClick={() => goToNilai(item)} key={index + 1}>
                                                            <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                                                <h1 className='text-green tracking-wide text-lg'>{item.nomor_urut}</h1>
                                                                <h1 className='text-xl font-semibold'>{item.name}</h1>
                                                                <h1 className='tracking-wide'>{item.siswa_ranting.name}</h1>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </>
                                            )
                                        } else if (dataPenguji.id_role === 'penguji ranting') {
                                            console.log('penguji ranting');
                                            return (
                                                <>
                                                    {dataSiswa.filter(dataEvent.tipe_ukt === 'UKCW' ? (a => a.id_event === dataEvent.id_event) : (a => a.id_ranting === dataPenguji.id_ranting && a.id_event === dataEvent.id_event)).map((item, index) => (
                                                        <button className='w-full' onClick={() => goToNilai(item)} key={index + 1}>
                                                            <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                                                <h1 className='text-green tracking-wide text-lg'>{item.nomor_urut}</h1>
                                                                <h1 className='text-xl font-semibold'>{item.name}</h1>
                                                                <h1 className='tracking-wide'>{item.siswa_ranting.name}</h1>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </>
                                            )
                                        } else {
                                            return (
                                                <h1 className='text-white'>Penguji ranting</h1>
                                            )
                                        }
                                    })()}

                                </div>

                                {/* Modal footer */}
                                <div className="flex items-center justify-end p-6 space-x-2">
                                    <button onClick={() => setShowModalSambung(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
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
                            </div>
                        </div>
                    </div>
                    <div className="bg-black opacity-70 fixed inset-0 z-40"></div>

                    <globalState.Provider value={{ modalFilter, setModalFilter }}>
                        <Modal_Filter onData={handleChildData} />
                    </globalState.Provider>
                </>

            ) : null}
        </>
    )
}

export default Modal_Sambung