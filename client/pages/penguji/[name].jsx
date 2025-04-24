import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { globalState } from '@/context/context'
import Header from './components/header'
import Modal_Filter from './components/modal_filter'
import MainNavigation from './components/Navbar'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const detail_event = () => {

    // deklarasi router
    const router = useRouter()
    const { name } = router.query
    
    // state modal
    const [modalFilter, setModalFilter] = useState(false)
    
    // state set jenis
    const {active, setActive} = useContext(globalState)

    // state
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
        let newActive = active ? active : 'senam'
        axios.get(BASE_URL + `siswa/event/${IdEvent}/${newActive}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataSiswa(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function search siswa by name
    const searchSiswa =() => {
        const token = localStorage.getItem('tokenPenguji')
        let newActive = active ? active : 'senam'
        axios.get(BASE_URL + `siswa/search/${dataEvent.id_event}/${searchName}/${newActive}`,{ headers: { Authorization: `Bearer ${token}` } })
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
        let newActive = active ? active : 'senam'
        if(data){
            axios.get(BASE_URL + `siswa/ranting/${dataEvent.id_event}/${data.id_ranting}/${newActive}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                console.log(res)
                setDataSiswa(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
        }
    }

    // function set jneis
    const onActive = (e) => {
        setActive(e)
    }

    // function go to penilaian page
    const goToNilai = (item) => {
        const token = localStorage.getItem('tokenPenguji')
        const uktSiswa = localStorage.getItem('dataUktSiswa')
        const data = {
            tipe_ukt: item.tipe_ukt,
            id_siswa: item.id_siswa,
            id_event: item.id_event,
            rayon: item.rayon
        }
        if (!uktSiswa) {
            axios.post(BASE_URL + `ukt_siswa`, data, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    router.push('./' + active)
                    localStorage.setItem('dataUktSiswa', JSON.stringify(res.data.data))
                })
        } else if (uktSiswa) {
            if (item.id_siswa == uktSiswa.id_siswa) {
                router.push('./' + active)
                localStorage.setItem('dataSiswa', JSON.stringify(item))
            } else if (item.id_siswa != uktSiswa.id_siswa) {
                axios.get(BASE_URL + `ukt_siswa/siswa/${item.id_siswa}`, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => {
                        if (res.data.data != null) {
                            router.push('./' + active)
                            localStorage.setItem('dataUktSiswa', JSON.stringify(res.data.data))
                            localStorage.setItem('dataSiswa', JSON.stringify(item))
                        } else {
                            axios.post(BASE_URL + `ukt_siswa`, data, { headers: { Authorization: `Bearer ${token}` } })
                                .then(res => {
                                    router.push('./' + active)
                                    localStorage.setItem('dataUktSiswa', JSON.stringify(res.data.data))
                                    localStorage.setItem('dataSiswa', JSON.stringify(item))
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err.message);
                    })

            }
        }
    }

    useEffect(() => {
       if (active === 'sambung'){
        setActive('senam');
        router.push('./sambung')
       } 
        setSearchName([])
        getDataSiswa()
    }, [active])

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
            <div className="font-lato">

                {/* awal wrapper konten utama */}
                <div className="w-full h-screen">

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-5 py-8">                  
                        

                        {/* card siswa information */}
                        {(() => {
                            if (dataPenguji.id_role === 'penguji cabang') {
                                console.log('penguji cabang');
                                return (
                                    <>
                                        {dataSiswa.filter(a => a.id_event === dataEvent.id_event).map((item, index) => (
                                            <button className='w-full text-left' onClick={() => goToNilai(item)} key={index + 1}>
                                                <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-[1.01] transition ease-in-out duration-300">
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
                                            <button className='w-full text-left' onClick={() => goToNilai(item)} key={index + 1}>
                                                <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-[1.01] transition ease-in-out duration-300">
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
                </div>
                       <div className="fixed bottom-0 z-50 block w-full">
                        {/* search */}
                        <div className="bg-navy py-1.5 px-4 rounded-md gap-x-2 flex items-center ">
                            {/* button search */}
                            <button onClick={() => searchSiswa()}>
                            <svg width="25" height="25" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.3746 18.3751L14.5684 14.5688" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            </button>

                            {/* input search */}
                            <input className='w-full p-1.5 focus:outline-none' placeholder='Search' type="text" onChange={(e) => setSearchName(e.target.value)} />

                            {/* filter button */}
                            <button onClick={() => setModalFilter(true)}>
                                <svg width="25" height="25" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M25.6667 3.5H2.33337L11.6667 14.5367V22.1667L16.3334 24.5V14.5367L25.6667 3.5Z" stroke="#6464F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <MainNavigation active={active} setActive={setActive}/>
                        </div>
            </div>
            
            <globalState.Provider value={{ modalFilter, setModalFilter}}>
                <Modal_Filter onData={handleChildData} />
            </globalState.Provider>
            
        </>
    )
}

export default detail_event