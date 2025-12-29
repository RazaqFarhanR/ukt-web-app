import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { globalState } from '@/context/context'
import Modal_Alert from './components/modal_alert';
import Header from './components/header'
import { useRouter } from 'next/router';
import { getSocket } from '../../lib/socket';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const teknik = () => {

    const [showModalAlert, setShowModalAlert] = useState(false);
    const router = useRouter()

    const [dataSiswa, setDataSiswa] = useState([])
    const [dataTeknik, setDataTeknik] = useState([]);
    const [alert, setAlert] = useState(false)

    const [selectedButton, SetSelectedButton] = useState([]);

    const updatedOptions = [...selectedButton];

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
            postDataTeknik()
            setShowModalAlert(false);
        }
    }, [alert])

    function handleButtonClick(id_teknik, name, selectedOption, warning) {
        const index = updatedOptions.findIndex(
            (option) => option.id_teknik === id_teknik
        );
        if (index === -1) {
            updatedOptions.push({ id_teknik, name, selectedOption, warning });
        } else {
            updatedOptions[index].name = name;
            updatedOptions[index].selectedOption = selectedOption;
            updatedOptions[index].warning = warning;
        }
        SetSelectedButton(updatedOptions);
    }

    const getDataSiswa = () => {
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        setDataSiswa(dataSiswa)
    }


    // function get data event
    const getDataTeknik = () => {
        const token = localStorage.getItem('tokenPenguji')

        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'));
        axios.get(BASE_URL + `teknik/ukt/${dataSiswa.tipe_ukt}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const data = res.data.data
                console.log(res);
                for (let i = 0; i < res.data.data.length; i++) {
                    const id_teknik = data[i].id_teknik
                    const name = data[i].name
                    const selectedOption = null
                    const warning = null
                    handleButtonClick(id_teknik, name, selectedOption, warning)
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }


    //  function post data teknik  //
    const postDataTeknik = () => {
        const socket = getSocket();

        const newData = selectedButton.map((option) => {
            return {
                id_teknik: option.id_teknik,
                name: option.name,
                predikat: option.selectedOption,
            };
        }).sort((a, b) => a.id_teknik - b.id_teknik); // Sort the array by id_teknik in ascending order
        let kosong = []
        const warning = "kolom ini harus di isi"
        for (let i = 0; i < newData.length; i++) {
            if (newData[i].predikat == null) {
                handleButtonClick(newData[i].id_teknik, newData[i].name, null, warning)
                kosong.push('1')
            }
        }
        kosong.length === 0 && setShowModalAlert(true)
        if (alert == true) {

            // -- data detail -- //
            const token = localStorage.getItem('tokenPenguji')
            const dataPenguji = JSON.parse(localStorage.getItem('penguji'))
            const dataDetail = {
                id_penguji: dataPenguji.id_penguji,
                id_siswa: dataSiswa.id_siswa,
                id_event: dataSiswa.id_event,
                tipe_ukt: dataSiswa.tipe_ukt,
                data: newData
            }


            axios.post(BASE_URL + `teknik_detail/exam`, dataDetail, { headers: { Authorization: `Bearer ${token}` } })
                .then(async res => {
                    console.log(res.data.data)

                    const id_teknik_detail = res.data.data.id_teknik_detail;
                    let baik = [];
                    let cukup = [];
                    let kurang = [];

                    for (let i = 0; i < newData.length; i++) {
                        if (newData[i].predikat == 'BAIK') {
                            baik.push('1');
                        } else if (newData[i].predikat == 'CUKUP') {
                            cukup.push('1');
                        } else if (newData[i].predikat == 'KURANG') {
                            kurang.push('1');
                        }
                        try {
                            const res = await axios.post(BASE_URL + `teknik_siswa`, {
                                id_teknik_detail: id_teknik_detail,
                                id_teknik: newData[i].id_teknik,
                                predikat: newData[i].predikat
                            }, { headers: { Authorization: `Bearer ${token}` } });
                            console.log(res);
                        } catch (error) {
                            console.log(error.message);
                        }
                    }
                    // -- redefine nilai -- //
                    const newBaik = baik.length * 3;
                    const newCukup = cukup.length * 2;
                    const newKurang = kurang.length;
                    // -- ukt siswa  -- //
                    const nilaiUkt = newBaik + newCukup + newKurang;
                    await axios.put(BASE_URL + `ukt_siswa/${uktSiswa.id_ukt_siswa}`, {
                        teknik: ((100 / (newData.length * 3)) * nilaiUkt)
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
                })
        } else {
            null
        }

    }

    useEffect(() => {
        getDataSiswa();
        getDataTeknik();
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

                        {/* wrapper fisik list */}
                        {selectedButton.map((item, index) => (
                            <div className="bg-navy rounded-md p-2 text-center text-white space-y-3 mb-3" key={item.id_teknik}>
                                <h1 className='text-xl font-semibold tracking-wider uppercase'>{item.name}</h1>

                                {/* fisik list */}
                                <div className="grid grid-cols-3 gap-x-3 items-center">

                                    {/* button kurang */}
                                    <button className={selectedButton.find(
                                        (option) =>
                                            option.id_teknik == item.id_teknik &&
                                            option.selectedOption == "KURANG"
                                    ) ? "font-semibold bg-purple rounded-md text-white py-1.5 uppercase" : "font-semibold bg-navy border-2 border-purple rounded-md text-purple py-1.5 uppercase"}
                                        onClick={() => handleButtonClick(item.id_teknik, item.name, 'KURANG')}>Kurang</button>

                                    {/* button cukup */}
                                    <button className={selectedButton.find(
                                        (option) =>
                                            option.id_teknik == item.id_teknik &&
                                            option.selectedOption == "CUKUP"
                                    ) ? "font-semibold bg-purple rounded-md text-white py-1.5 uppercase" : "font-semibold bg-navy border-2 border-purple rounded-md text-purple py-1.5 uppercase"}
                                        onClick={() => handleButtonClick(item.id_teknik, item.name, 'CUKUP')}>Cukup</button>

                                    {/* button baik */}
                                    <button className={selectedButton.find(
                                        (option) =>
                                            option.id_teknik == item.id_teknik &&
                                            option.selectedOption == "BAIK"
                                    ) ? "font-semibold bg-purple rounded-md text-white py-1.5 uppercase" : "font-semibold bg-navy border-2 border-purple rounded-md text-purple py-1.5 uppercase"}
                                        onClick={() => handleButtonClick(item.id_teknik, item.name, 'BAIK')}>Baik</button>
                                </div>

                                <h1 className='text-xl font-semibold tracking-wider text-red italic'>{item?.warning}</h1>
                            </div>
                        ))}

                        <div className='bg-yellow rounded-md p-2 text-white mb-8 shadow shadow-slate-700 text-center text-2xl font-lato font-bold uppercase'
                            onClick={postDataTeknik}>Selesai</div>
                    </div>
                </div>
            </div>
            <globalState.Provider value={{ showModalAlert, setShowModalAlert }}>
                <Modal_Alert onData={handleAlertData} />
            </globalState.Provider>
        </>
    )
}

export default teknik   