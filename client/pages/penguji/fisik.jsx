import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { globalState } from '@/context/context'
import Header from './components/header'
import Modal_Alert from './components/modal_alert';
import { useRouter } from 'next/router';
import { getSocket } from '../../lib/socket';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fisik = () => {

    const [showModalAlert, setShowModalAlert] = useState(false);
    const router = useRouter()

    // state
    const [alert, setAlert] = useState(false)
    const [dataSiswa, setDataSiswa] = useState([])
    const [dataStandartFisik, setDataStandartFisik] = useState([])
    const [mft, setMft] = useState(0);
    const [pushUp, setPushUp] = useState(0);
    const [spirPA, setSpirPA] = useState(0);
    const [spirPB, setSpirPB] = useState(0);
    const [spirDada, setSpirDada] = useState(0);
    const [spirPaha, setSpirPaha] = useState(0);
    const [plank, setPlank] = useState(0);

    // state timer
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    // function get data siswa from local storage
    const getDataSiswa = () => {
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        setDataSiswa(dataSiswa)
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

    // function get data standart fisik
    const getDataStandartFisik = () => {
        const token = localStorage.getItem('tokenPenguji')
        const dataSiswa1 = JSON.parse(localStorage.getItem('dataSiswa'));
        const tipe_ukt = dataSiswa1.tipe_ukt;
        console.log(dataSiswa1);
        const peserta = dataSiswa1.peserta;
        axios.post(BASE_URL + `standar_fisik/peserta`, {
            tipe_ukt: tipe_ukt,
            peserta: peserta
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                console.log(res.data);
                setDataStandartFisik(res.data);
            })
            .catch(err => {
                console.log(err.message);
            })
    }
    const handleSave = async () => {
        const socket = getSocket();

        setShowModalAlert(true)
        if (alert) {
            // -- data detail -- //
            const uktSiswa = JSON.parse(localStorage.getItem('dataUktSiswa'))
            const token = localStorage.getItem('tokenPenguji')
            const dataPenguji = JSON.parse(localStorage.getItem('penguji'))

            const primeMft = mft.toFixed(1)
            const mftNew = ((primeMft / dataStandartFisik.mft) * 100)
            const pushUpNew = (pushUp / dataStandartFisik.push_up) * 100
            const spirPANew = (spirPA / dataStandartFisik.spir_perut_atas) * 100
            const spirPBNew = (spirPB / dataStandartFisik.spir_perut_bawah) * 100
            const spirDadaNew = ((spirDada / dataStandartFisik.spir_dada) * 100)
            let spirPahaNew = ((spirPaha / dataStandartFisik.spir_paha) * 100)
            let plankNew = ((plank / dataStandartFisik.plank) * 100)

            if (plankNew > 100) {
                plankNew = 100
            }

            if (spirPahaNew > 100) {
                spirPahaNew = 100
            }

            console.log(plankNew);
            console.log(spirPahaNew);
            
            const data = {
                id_penguji: dataPenguji.id_penguji,
                id_event: dataSiswa.id_event,
                id_siswa: dataSiswa.id_siswa,
                mft: primeMft,
                push_up: pushUp,
                spir_perut_atas: spirPA,
                spir_perut_bawah: spirPB,
                spir_dada: spirDada,
                spir_paha: spirPaha,
                plank: plank
            }
            axios.post(BASE_URL + `fisik`, data, { headers: { Authorization: `Bearer ${token}` } },)
                .then((res) => {
                    console.log(res);
                })
                .catch((error) => {
                    console.log(error.message);
                });
            // -- ukt siswa  -- //
            const nilaiUkt = ((mftNew + pushUpNew + spirPANew + spirPBNew + spirDadaNew + spirPahaNew + plankNew) / 7).toFixed(2)
            console.log(nilaiUkt);
            
            await axios.put(BASE_URL + `ukt_siswa/${uktSiswa.id_ukt_siswa}`, {
                fisik: nilaiUkt
            }, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    console.log(res)
                    socket.emit('submit_nilai', {
                        event_id: dataSiswa.id_event
                    });
                    router.back()
                })
                .catch(err => {
                    console.log(err.message);
                })
        } else {
            null
        }
    }
    useEffect(() => {
        getDataSiswa()
        getDataStandartFisik()
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

    useEffect(() => {
        console.log(mft)
    }, [mft])

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

                        {/* wrapper mft */}
                        <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3">
                            <h1 className='text-xl font-semibold tracking-wider uppercase'>MFT</h1>

                            {/* fisik list */}
                            <div className="grid grid-cols-3 gap-x-3 items-center">

                                {/* button minus */}
                                <button className='bg-red rounded-md text-center text-2xl font-bold'
                                    onClick={() => {
                                        const increment = 0.1;
                                        const newMft = parseFloat((mft - increment).toFixed(1));
                                        setMft(newMft);
                                    }}
                                >
                                    -
                                </button>

                                {/* score indicator */}
                                <h1 className='outline outline-purple rounded-md h-full flex items-center justify-center text-xl font-semibold'>
                                    <input
                                        type="number"
                                        value={mft}
                                        onChange={(e) => setMft(parseFloat(e.target.value))}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        className='w-full text-center bg-transparent outline-none'
                                    />
                                </h1>

                                {/* button plus */}
                                <button className='bg-purple rounded-md text-center text-2xl font-bold'
                                    onClick={() => {
                                        const increment = 0.1;
                                        const newMft = parseFloat((mft + increment).toFixed(1));
                                        setMft(newMft);
                                    }}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* wrapper push_up */}
                        <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3">
                            <h1 className='text-xl font-semibold tracking-wider uppercase'>Push Up</h1>

                            {/* fisik list */}
                            <div className="grid grid-cols-3 gap-x-3 items-center">

                                {/* button minus */}
                                <button className='bg-red rounded-md text-center text-2xl font-bold'
                                    onClick={() => setPushUp(pushUp - 1)}
                                >
                                    -
                                </button>

                                {/* score indicator */}
                                <h1 className='outline outline-purple rounded-md h-full flex items-center justify-center text-xl font-semibold'>
                                    <input
                                        type="number"
                                        value={pushUp}
                                        onChange={(e) => setPushUp(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        className='w-full text-center bg-transparent outline-none'
                                    />
                                </h1>

                                {/* button plus */}
                                <button className='bg-purple rounded-md text-center text-2xl font-bold'
                                    onClick={() => setPushUp(pushUp + 1)}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* wrapper spir_perut_atas */}
                        <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3">
                            <h1 className='text-xl font-semibold tracking-wider uppercase'>Spir Perut Atas</h1>

                            {/* fisik list */}
                            <div className="grid grid-cols-3 gap-x-3 items-center">

                                {/* button minus */}
                                <button className='bg-red rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirPA(spirPA - 1)}
                                >
                                    -
                                </button>

                                {/* score indicator */}
                                <h1 className='outline outline-purple rounded-md h-full flex items-center justify-center text-xl font-semibold'>
                                    <input
                                        type="number"
                                        value={spirPA}
                                        onChange={(e) => setSpirPA(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        className='w-full text-center bg-transparent outline-none'
                                    />
                                </h1>

                                {/* button plus */}
                                <button className='bg-purple rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirPA(spirPA + 1)}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* wrapper spir_perut_bawah */}
                        <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3">
                            <h1 className='text-xl font-semibold tracking-wider uppercase'>Spir Perut Bawah</h1>

                            {/* fisik list */}
                            <div className="grid grid-cols-3 gap-x-3 items-center">

                                {/* button minus */}
                                <button className='bg-red rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirPB(spirPB - 1)}
                                >
                                    -
                                </button>

                                {/* score indicator */}
                                <h1 className='outline outline-purple rounded-md h-full flex items-center justify-center text-xl font-semibold'>
                                    <input
                                        type="number"
                                        value={spirPB}
                                        onChange={(e) => setSpirPB(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        className='w-full text-center bg-transparent outline-none'
                                    />
                                </h1>

                                {/* button plus */}
                                <button className='bg-purple rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirPB(spirPB + 1)}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* wrapper spir_dada */}
                        <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3">
                            <h1 className='text-xl font-semibold tracking-wider uppercase'>Spir Dada</h1>

                            {/* fisik list */}
                            <div className="grid grid-cols-3 gap-x-3 items-center">

                                {/* button minus */}
                                <button className='bg-red rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirDada(spirDada - 1)}
                                >
                                    -
                                </button>

                                {/* score indicator */}
                                <h1 className='outline outline-purple rounded-md h-full flex items-center justify-center text-xl font-semibold'>
                                    <input
                                        type="number"
                                        value={spirDada}
                                        onChange={(e) => setSpirDada(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        className='w-full text-center bg-transparent outline-none'
                                    />
                                </h1>

                                {/* button plus */}
                                <button className='bg-purple rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirDada(spirDada + 1)}>
                                    +
                                </button>
                            </div>
                        </div>
                        

                        {/* wrapper Plank */}
                        <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3">
                            <h1 className='text-xl font-semibold tracking-wider uppercase'>Plank</h1>

                            {/* fisik list */}
                            <div className="grid grid-cols-3 gap-x-3 items-center">
                                {/* button minus */}
                                <button className='bg-red rounded-md text-center text-2xl font-bold'
                                    onClick={() => setPlank(plank - 1)}
                                >
                                    -
                                </button>

                                {/* score indicator */}
                                <h1 className='outline outline-purple rounded-md h-full flex items-center justify-center text-xl font-semibold'>
                                    <input
                                        type="number"
                                        value={plank}
                                        onChange={(e) => setPlank(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        className='w-full text-center bg-transparent outline-none'
                                    />
                                </h1>

                                {/* button plus */}
                                <button className='bg-purple rounded-md text-center text-2xl font-bold'
                                    onClick={() => setPlank(plank + 1)}>
                                    +
                                </button>
                            </div>

                        </div>

                        {/* wrapper spir_paha */}
                        <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3">
                            <h1 className='text-xl font-semibold tracking-wider uppercase'>Spir Paha</h1>

                            {/* fisik list */}
                            <div className="grid grid-cols-3 gap-x-3 items-center">

                                {/* button minus */}
                                <button className='bg-red rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirPaha(spirPaha - 1)}
                                >
                                    -
                                </button>

                                {/* score indicator */}
                                <h1 className='outline outline-purple rounded-md h-full flex items-center justify-center text-xl font-semibold'>
                                    <input
                                        type="number"
                                        value={spirPaha}
                                        onChange={(e) => setSpirPaha(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        className='w-full text-center bg-transparent outline-none'
                                    />
                                </h1>

                                {/* button plus */}
                                <button className='bg-purple rounded-md text-center text-2xl font-bold'
                                    onClick={() => setSpirPaha(spirPaha + 1)}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* submit button */}
                        <div className='bg-yellow rounded-md p-2 text-white mb-8 shadow shadow-slate-700 text-center text-xl uppercase font-bold font-lato my-3'
                            onClick={handleSave}>Selesai</div>

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
            </div>
            {/* new comment */}

            <globalState.Provider value={{ showModalAlert, setShowModalAlert }}>
                <Modal_Alert onData={handleAlertData} />
            </globalState.Provider>
        </>
    )
}

export default fisik