import React, { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import { globalState } from '@/context/context'
import Header from './components/header'
import Modal_Sambung from './components/modal_sambung';
import Modal_Alert from './components/modal_alert';
import { useRouter } from 'next/router';
import MainNavigation from './components/Navbar';
import { getSocket } from '../../lib/socket';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const sambung = () => {

    const [showModalSambung, setShowModalSambung] = useState(false)
    const [showModalAlert, setShowModalAlert] = useState(false);
    const router = useRouter()

    // state
    const [alert, setAlert] = useState(false)
    const [dataNilai1, setDataNilai1] = useState([])
    const [dataNilai2, setDataNilai2] = useState([])
    const [dataSiswa1, setDataSiswa1] = useState([])
    const [dataSiswa2, setDataSiswa2] = useState([])
    const [action, setAction] = useState(false)
    const [plus, setPlus] = useState(0);
    const [nilai1, setNilai1] = useState(50)
    const [nilai2, setNilai2] = useState(50)
    const [arraySiswa1, setArraySiswa1] = useState([])
    const [arraySiswa2, setArraySiswa2] = useState([])
    const [event, setEvent] = useState()

    const { active, setActive } = useContext(globalState)

    // state timer
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    // function untuk timer
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
            return () => clearInterval(intervalRef.current);
        }
    }, [isRunning]);

    function handleStart() {
        setIsRunning(true);
    }

    function handlePause() {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    }

    function handleRestart() {
        setSeconds(0);
        clearInterval(intervalRef.current);
        setIsRunning(false);
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    //function get data siswa
    const getData = () => {
        const token = localStorage.getItem('tokenPenguji')
        const array = [
            { id: 1, green: null },
            { id: 2, green: null },
            { id: 3, green: null },
            { id: 4, green: null },
            { id: 5, green: null },
            { id: 6, green: null },
            { id: 7, green: null },
            { id: 8, green: null },
            { id: 9, green: null },
            { id: 10, green: null },
            { id: 11, green: null },
            { id: 12, green: null },
            { id: 13, green: null },
            { id: 14, green: null },
            { id: 15, green: null },
        ]

        axios.get(BASE_URL + `nilai_sambung`, { headers: { Authorization: `Bearer ${token}` } },)
            .then(result => {
                const data = result.data.data
                let count = 0
                for (let i = 0; i < data.length; i++) {
                    const item = data[i]
                    item.status = null
                    item.tipe === true ? count++ : ''
                }
                setDataNilai1(data);
                setDataNilai2(data);
                setPlus(count);
                setArraySiswa1(array)
                setArraySiswa2(array)
                console.log(plus);
            })
            .catch(error => {
                console.log(error.message)
            })
    }
    const updateArrays = (id, value, posisi) => {
        // menentukan array mana yang diubah berdasakan kondisi posisi
        const dummyArray = posisi > 1 ? [...arraySiswa2] : [...arraySiswa1];

        // Mapping dummy array untuk mengubah item yang diperlukan
        const updatedArray = dummyArray.map(item => {
            if (item.id === id) {
                return { ...item, green: value };
            }
            return item;
        });

        // Update the appropriate state array based on the posisi condition
        if (posisi > 1) {
            setArraySiswa2(updatedArray);
        } else {
            setArraySiswa1(updatedArray);
        }
    };

    // handle perubahan score siswa sesuai ketika button ditekan
    // sesuai status button ketika ditekan
    // status = null, ditambah nilai pertama, status jadi 'ungu'
    // status = 'ungu' ditambah nilai kedua minus nilai pertama, status jadi 'hijau'
    // status = 'hijau' nilai dikurangi sejumlah nilai kedua, status jadi null
    const handleClick = (id, siswa, score1, score2, status, tipe) => {
        const data = siswa > 1 ? dataNilai2 : dataNilai1
        const copyData = [...data]

        const index = copyData.findIndex(
            (option) => option.id_nilai_sambung === id
        )
        if (status === null) {
            copyData[index] = { ...data[index], status: 'ungu' }
            if (siswa === 1) {
                setNilai1(nilai1 + score1)
                updateArrays(id, false, 1)
            } else {
                setNilai2(nilai2 + score1)
                updateArrays(id, false, 2)
            }
        } else if (status === 'ungu' && tipe === true) {
            copyData[index] = { ...data[index], status: 'hijau' }
            index.status === 'hijau'
            if (siswa === 1) {
                setNilai1(nilai1 + (score2 - score1))
                updateArrays(id, true, 1)
            } else {
                setNilai2(nilai2 + (score2 - score1))
                updateArrays(id, true, 2)
            }
        } else if (status === 'hijau') {
            copyData[index] = { ...data[index], status: null }
            index.status === null
            if (siswa === 1) {
                setNilai1(nilai1 - score2)
                updateArrays(id, null, 1)
            } else {
                setNilai2(nilai2 - score2)
                updateArrays(id, null, 2)
            }
        } else {
            copyData[index] = { ...data[index], status: null }
            index.status === null
            if (siswa === 1) {
                setNilai1(nilai1 - score1)
                updateArrays(id, null, 1)
            } else {
                setNilai2(nilai2 - score1)
                updateArrays(id, null, 2)
            }
        }
        siswa > 1 ? setDataNilai2(copyData) : setDataNilai1(copyData)

    }
    // function set jneis
    const onActive = (e) => {
        setActive(e)
    }

    const handleChildData = (data) => {
        if (data) {
            data.posisi < 2
                ? setDataSiswa1(data)
                : setDataSiswa2(data);

            window.scrollTo({
                top: 0,
                behavior: 'smooth' // You can change this to 'auto' for instant scrolling
            });
        }
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
            postDataSambung()
            setShowModalAlert(false);
        }
    }, [alert])

    const postDataSambung = () => {
        const socket = getSocket();

        const token = localStorage.getItem('tokenPenguji')
        const penguji = JSON.parse(localStorage.getItem('penguji'));
        const event = JSON.parse(localStorage.getItem('event'));
        const posisi1 = localStorage.getItem('posisi1')
        const posisi2 = localStorage.getItem('posisi2')
        let score1 = nilai1 > 100 ? 100 : nilai1
        let score2 = nilai2 > 100 ? 100 : nilai2
        setShowModalAlert(true);
        if (alert) {
            const id_penguji = penguji.id_penguji
            const data = {
                id_event: event.id_event,
                id_penguji: id_penguji,
                id_siswa1: dataSiswa1.id_siswa,
                id_siswa2: dataSiswa2.id_siswa,
                nilai1: score1,
                nilai2: score2
            }

            axios.post(BASE_URL + `sambung`, data, { headers: { Authorization: `Bearer ${token}` } },)
                .then((res) => {
                    const dataSambung = res.data.data

                    const detail1 = {
                        id_sambung: dataSambung.id_sambung,
                        name: dataSiswa1.name,
                        posisi: 1
                    }
                    const detail2 = {
                        id_sambung: dataSambung.id_sambung,
                        name: dataSiswa2.name,
                        posisi: 2
                    }
                    for (let i = 0; i < 2; i++) {
                        axios.post(BASE_URL + `gerakan/detail`, i < 1 ? detail1 : detail2, { headers: { Authorization: `Bearer ${token}` } },)
                            .then((res) => {
                                axios.post(BASE_URL + `gerakan/array`,
                                    {
                                        dataArray: i < 1 ? arraySiswa1 : arraySiswa2,
                                        id_detail: res.data.data.id_detail
                                    }, { headers: { Authorization: `Bearer ${token}` } },)
                                    .then((res) => {
                                        console.log(res);
                                    })
                                    .catch((error) => {
                                        console.log(error.message);
                                    })
                            })
                            .catch((error) => {
                                console.log(error.message);
                            })
                    }

                })
                .catch((error) => {
                    console.log(error.message);
                });

            for (let i = 0; i < 2; i++) {
                axios.put(BASE_URL + `ukt_siswa/${i == 0 ? posisi1 : posisi2}`, {
                    sambung: i == 0 ? score1 : score2
                }, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => {
                        console.log(res)
                        socket.emit('submit_nilai', {
                            event_id: event.id_event
                        });
                    })
            }
            router.back()

        }

    }

    useEffect(() => {
        const event = JSON.parse(localStorage.getItem('event'));
        setEvent(event)
        getData()

        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
            socket.emit('join_event', {
                role: 'penguji',
                event_id: event.id_event,
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
                    <div className="sticky bottom-0 z-10 header border-b bg-navy shadow shadow-black w-full px-2 py-3 font-lato">
                            <button onClick={() => router.push('../penguji/' + event.name)} className="text-slate-600 text-2xl w-10 h-10 absolute top-0 translate-y-1 px-2 group">
                                <svg className='stroke-white group-hover:stroke-purple duration-300' width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23 10H2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 18L2 10L10 2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        <div className="flex justify-center items-center px-4">

                            {/* Title */}
                            <h1 className='text-xl font-semibold text-green tracking-wide'>SAMBUNG</h1>
                        </div>
                    </div>
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-5 py-2">

                        {/* wrapper info siswa */}
                        <div className='flex gap-x-3 text-center'>

                            <div className='flex flex-col w-1/2'>
                                <div className="rounded-t-md bg-gradient-to-br from-[#9A4BE9] to-[#16D4FC] p-1 text-center shadow-sm shadow-slate-400">
                                    <h1 className='text-white text-md  md:text-xl tracking-wide uppercase font-bold font-lato'>SISWA 1</h1>
                                </div>
                                {/* card siswa information */}
                                <div className="bg-navy rounded-b-md p-3 py-5 text-white mb-4 shadow shadow-slate-700 hover:shadow-purple transition ease-in-out duration-300"
                                    onClick={() => {
                                        setShowModalSambung(true)
                                        setAction('posisi1')
                                    }}>
                                    {dataSiswa1.posisi > 0
                                        ? <>
                                            <div className='flex items-center justify-center gap-x-0.5 text-green'>
                                                <h1 className='text-sm md:text-lg '>{dataSiswa1.nomor_urut}</h1>
                                                <h1 className='text-sm md:text-lg '>-</h1>
                                                <h1 className='tracking-wide text-sm md:text-lg'>{dataSiswa1.rayon}</h1>
                                            </div>
                                            <h1 className='text-sm mt-2 md:text-xl font-semibold'>{dataSiswa1.name}</h1>
                                        </>
                                        : <h1 className='text-sm md:text-lg uppercase font-bold font-lato' >Pilih Siswa</h1>

                                    }
                                </div>
                            </div>
                            <div className='flex flex-col w-1/2'>
                                <div className="rounded-t-md bg-gradient-to-br from-[#9A4BE9] to-[#16D4FC] p-1 text-center shadow-sm shadow-slate-400">
                                    <h1 className='text-white text-md  md:text-xl tracking-wide uppercase font-bold font-lato'>SISWA 2</h1>
                                </div>
                                {/* card siswa information */}
                                <div className="bg-navy rounded-b-md p-3 py-5 text-white mb-4 shadow shadow-slate-700 hover:shadow-purple transition ease-in-out duration-300"
                                    onClick={() => {
                                        setShowModalSambung(true)
                                        setAction('posisi2')
                                    }}>
                                    {dataSiswa2.posisi > 1
                                        ? <>
                                            <div className='flex items-center justify-center gap-x-0.5 text-green'>
                                                <h1 className='text-sm md:text-lg '>{dataSiswa2.nomor_urut}</h1>
                                                <h1 className='text-sm md:text-lg '>-</h1>
                                                <h1 className='tracking-wide text-sm md:text-lg'>{dataSiswa2.rayon}</h1>
                                            </div>
                                            <h1 className='text-sm mt-2 md:text-xl font-semibold'>{dataSiswa2.name}</h1>
                                        </>
                                        : <h1 className='text-sm md:text-lg uppercase font-bold font-lato' >Pilih Siswa</h1>

                                    }
                                </div>
                            </div>


                        </div>
                        <div className="rounded-md bg-gradient-to-br from-[#9A4BE9] to-[#16D4FC] text-center shadow-sm shadow-slate-400 w-full">
                            <h1 className='font-bold text-xl text-white'>POIN</h1>
                        </div>
                        {dataNilai1.filter(item => item.tipe === true).map((item, index) => (
                            <div className='flex gap-x-3 my-3 text-center uppercase border-purple ' key={index}>

                                <div className={
                                    item.status === null
                                        ? 'w-1/4 rounded-md border-2 border-purple p-4 bg-navy'
                                        : item.status === 'ungu'
                                            ? 'w-1/4 rounded-md border-2 border-purple p-4 bg-purple'
                                            : 'w-1/4 rounded-md border-2 border-green p-4 bg-green'
                                } onClick={
                                    () => handleClick(item.id_nilai_sambung, 1, item.nilai1, item.nilai2, item.status, true)
                                }></div>
                                <div className='w-1/2 rounded-md border-2 border-purple p-2 bg-navy text-xs md:text-xl text-white font-bold'>{item.name}</div>
                                <div className={
                                    dataNilai2[index].status === null
                                        ? 'w-1/4 rounded-md border-2 border-purple p-4 bg-navy'
                                        : dataNilai2[index].status === 'ungu'
                                            ? 'w-1/4 rounded-md border-2 border-purple p-4 bg-purple'
                                            : 'w-1/4 rounded-md border-2 border-green p-4 bg-green'
                                } onClick={
                                    () => handleClick(item.id_nilai_sambung, 2, item.nilai1, item.nilai2, dataNilai2[index].status, true)
                                }></div>
                            </div>
                        ))}
                        <div className="rounded-md bg-gradient-to-br from-[#9A4BE9] to-[#16D4FC] text-center shadow-sm shadow-slate-400 w-full">
                            <h1 className='font-bold text-xl text-white'>POIN +</h1>
                        </div>

                        {dataNilai1.filter(item => item.tipe === false).map((item, index) => (
                            <div className='flex gap-x-3 my-3 text-center uppercase border-purple' key={index}>

                                <div className={
                                    item.status === null
                                        ? 'w-1/4 rounded-md border-2 border-purple p-2 bg-navy'
                                        : item.status === 'ungu'
                                            ? 'w-1/4 rounded-md border-2 border-purple p-2 bg-purple'
                                            : 'w-1/4 rounded-md border-2 border-green p-2 bg-green'
                                } onClick={
                                    () => handleClick(item.id_nilai_sambung, 1, item.nilai1, item.nilai2, item.status, false)
                                }></div>
                                <div className='w-1/2 rounded-md border-2 border-purple p-2 bg-navy text-xs md:text-xl text-white font-bold'>{item.name}</div>
                                <div className={
                                    dataNilai2[index + plus].status === null
                                        ? 'w-1/4 rounded-md border-2 border-purple p-2 bg-navy'
                                        : 'w-1/4 rounded-md border-2 border-purple p-2 bg-purple'
                                } onClick={
                                    () => handleClick(item.id_nilai_sambung, 2, item.nilai1, item.nilai2, dataNilai2[index + plus].status, false)
                                }></div>
                            </div>
                        ))}

                        <div className='bg-yellow mb-28 rounded-md p-3 text-white shadow shadow-slate-700 text-center font-bold uppercase'
                            onClick={postDataSambung}>Selesai</div>
                        {/* wrapper timer */}
                        <div className="fixed bottom-0 left-0 w-full bg-navy text-white px-4 py-2">
                            <div className="flex justify-center items-center">
                                <div className="flex items-center space-x-3">
                                    <button className="bg-green rounded-md text-center text-2xl font-bold px-4 py-2" onClick={handleRestart}>⥀</button>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-center text-white text-3xl font-bold">{minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}</div>
                                    </div>
                                    {!isRunning ?
                                        <button className="bg-green rounded-md text-center text-2xl font-bold px-4 py-2" onClick={handleStart}>▶</button>
                                        :
                                        <button className="bg-green rounded-md text-center text-2xl font-bold px-4 py-2" onClick={handlePause}>⦷</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <globalState.Provider value={{ showModalSambung, setShowModalSambung, action, setAction }}>
                <Modal_Sambung onData={handleChildData} />
            </globalState.Provider>
            <globalState.Provider value={{ showModalAlert, setShowModalAlert }}>
                <Modal_Alert onData={handleAlertData} />
            </globalState.Provider>
        </>
    )
}

export default sambung