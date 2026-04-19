import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import Pagination from '../../components/Pagination';
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
import axios from 'axios';
import ModalSelesai from '../../components/ModalSelesai';
import ModalAlert from '../../components/ModalAlert';
const SECRET = process.env.NEXT_PUBLIC_SECRET;
import { getSocket } from '../../../../lib/socket';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ujian = () => {

    const router = useRouter()
    const [showModalSelesai, setShowModalSelesai] = useState (false)
    const [showModalAlert, setShowModalAlert] = useState (false)
    const [showModalSyncWait, setShowModalSyncWait] = useState (false)
    const [isTimeUp, setIsTimeUp] = useState (false)
    const [isLoading, setIsLoading] = useState (false)
    const [success, setSuccess] = useState (false)
    const [dataUjian,setDataUjian] = useState([])
    const [dataEvent,setDataEvent] = useState([])
    const [dataSiswa,setDataSiswa] = useState([])
    const [soal,setSoal] = useState([])
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1);
    const page = searchParams.get('page') ?? '1'

    const {tipe, event, ranting} = router.query
    
    const [selectedOption, setSelectedOption] = useState("")

    const encryptId = (str) => {
        const ciphertext = AES.encrypt(JSON.stringify(str), SECRET);
        return encodeURIComponent(ciphertext.toString());
    }

    const decryptId = (str) => {
        const decodedStr = decodeURIComponent(str);
        return AES.decrypt(decodedStr, SECRET).toString(enc.Utf8);
    }

    const getDataSiswa = () => {
        try {
            const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
            setDataSiswa(dataSiswa || {})
        } catch (e) {
            console.error("Data siswa parse error", e);
            setDataSiswa({})
        }
    }

    const [ minutes, setMinutes ] = useState(10);
    const [seconds, setSeconds ] =  useState(0);
    const getDataUjian = () => {
        const token = localStorage.getItem('tokenSiswa')
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        let data = {
            tipe_ukt: dataSiswa.tipe_ukt.toLowerCase(),
            id_event: dataSiswa.id_event,
            id_siswa: dataSiswa.id_siswa,
        }
        let session
        axios.post(BASE_URL + 'session/getdata', data)
        .then(res => {
            session = res.data
            setDataUjian(res.data)
            setMinutes(res.data.minute)
            setSeconds(res.data.second)
            getSoal(res.data.data.id_session, page)

        })
        .catch((err) => {
            console.log(err.message);
        })
    }
    
    const getSoal = (id, page) => {
        const token = localStorage.getItem('tokenSiswa')
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        let data = {
            id_session: id,
            id_siswa: dataSiswa.id_siswa
        }
        axios.post(BASE_URL + 'session/getsoal/'+ page, data)
        .then(res => {
            setSoal(res.data.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [syncQueue, setSyncQueue] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        if (showModalSyncWait && syncQueue.length === 0) {
            setShowModalSyncWait(false);
            if (!isTimeUp) {
                setShowModalAlert(true);
            }
        }
    }, [syncQueue.length, showModalSyncWait, isTimeUp]);

    useEffect(() => {
        if (isTimeUp && syncQueue.length === 0 && !isLoading && !success) {
            setShowModalAlert(true);
            handleSave();
        }
    }, [syncQueue.length, isTimeUp, isLoading, success]);

    // Sync answer to backend with retry logic
    const syncAnswer = async (id_soal, selectedOption) => {
        try {
            if (!dataUjian || !dataUjian.data) {
                return false; // Wait until data is loaded
            }

            const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'));
            const payload = {
                id_session: dataUjian.data.id_session,
                id_siswa: dataSiswa.id_siswa,
                id_soal,
                selectedOption
            };

            const res = await axios.post(BASE_URL + 'session/sync', payload);
            // If server responds, remove from queue (even if status is false, to prevent infinite loops)
            return true; 
        } catch (error) {
            console.error("Sync failed:", error.message);
            return false;
        }
    };

    // Effect to flush the sync queue
    useEffect(() => {
        const flushQueue = async () => {
            if (syncQueue.length === 0 || isSyncing) return;
            setIsSyncing(true);

            try {
                const remainingQueue = [...syncQueue];
                const nextItem = remainingQueue[0];

                const success = await syncAnswer(nextItem.id_soal, nextItem.selectedOption);
                if (success) {
                    remainingQueue.shift();
                    setSyncQueue(remainingQueue);
                    localStorage.setItem('syncQueue', JSON.stringify(remainingQueue));
                }
            } catch (err) {
                console.error("Flush queue error", err);
            } finally {
                setIsSyncing(false);
            }
        };

        const interval = setInterval(flushQueue, 3000);
        return () => clearInterval(interval);
    }, [syncQueue, isSyncing, dataUjian]);

    // Initialize queue from localStorage
    useEffect(() => {
        try {
            const savedQueue = localStorage.getItem('syncQueue');
            if (savedQueue) {
                setSyncQueue(JSON.parse(savedQueue));
            }
        } catch (e) {
            console.error("Sync queue parse error", e);
            setSyncQueue([]);
        }
    }, []);

    // function to handle changes in the selected option and update the state
    function handleOptionChange(nomor, id_soal, selectedOption) {
        const updatedOptions = [...selectedOptions];
        const index = updatedOptions.findIndex(
            (option) => option.id_soal === id_soal
        );
        if (index === -1) {
            updatedOptions.push({ nomor, id_soal, selectedOption });
        } else {
            updatedOptions[index].selectedOption = selectedOption;
        }
        setSelectedOptions(updatedOptions);
        localStorage.setItem('Jawaban', JSON.stringify(updatedOptions));

        // Add to sync queue
        const newSyncItem = { id_soal, selectedOption };
        const newQueue = [...syncQueue, newSyncItem];
        setSyncQueue(newQueue);
        localStorage.setItem('syncQueue', JSON.stringify(newQueue));
    }

    const handleSave = () => {
        const socket = getSocket();

        if (syncQueue.length > 0) {
            setShowModalAlert(false);
            setShowModalSyncWait(true);
            return;
        }

        setIsLoading(true)
        let jawaban = []
        let dataUktSiswa = {}

        try {
            if(localStorage.getItem("Jawaban") !== null){
                jawaban = JSON.parse(localStorage.getItem("Jawaban"))
            }
            if(localStorage.getItem("dataUktSiswa") !== null) {
                dataUktSiswa = JSON.parse(localStorage.getItem('dataUktSiswa'));
            }
        } catch (e) {
            console.error("Error loading answers or user data", e);
        }

        let data = {
            id_ukt_siswa: dataUktSiswa?.id_ukt_siswa,
            id_session: dataUjian?.data?.id_session || '',
            id_siswa: dataSiswa?.id_siswa || '',
            jawaban: jawaban
        }

        axios.post(BASE_URL+'session/koreksi', data)
        .then(res => {
            socket.emit('submit_nilai', {
                event_id: dataSiswa.id_event
            });
            setIsLoading(false)
            setSuccess(true)
            localStorage.removeItem('Jawaban');
            localStorage.removeItem('syncQueue');
            setTimeout(() => {
                Logout()
            }, 3000);
        })
        .catch((err)=> {
            console.log(err.message);
            setIsLoading(false);
            alert("Gagal mengirim jawaban. Mohon coba lagi.");
        })
    }

    const Logout = () => {
        try {
            const dataEvent = JSON.parse(JSON.parse(decryptId(event)))
            localStorage.clear()
            router.push(`/siswa/ukcw/${encryptId(JSON.stringify({id:dataEvent.id,name:dataEvent.name}))}`)
        } catch (e) {
            localStorage.clear()
            router.push('/siswa')
        }
    }
    
    const nextPage = () => {
        router.push({query: {tipe: tipe, ranting: ranting, event: event, page:(Number(page) + 1)}})
        getSoal(dataUjian.data.id_session, (Number(page) + 1))
        setCurrentPage((Number(page) + 1))
    }

    useEffect(() => {
        if (dataUjian.length != 0){
            getSoal(dataUjian.data.id_session, (Number(page)))
        }
    }, [page])
    

    // timer
    useEffect(()=>{
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                    setMinutes(0)
                    setSeconds(0)
                    setIsTimeUp(true)
                    if (syncQueue.length > 0) {
                        setShowModalSyncWait(true)
                    } else {
                        setShowModalAlert(true)
                        handleSave()
                    }
                } else if (minutes < 1 && seconds < 1) {
                    clearInterval(myInterval)
                    setMinutes(0)
                    setSeconds(0)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
        };
    },[seconds, minutes, syncQueue.length]);

    const getJawaban = async () => {
        try {
            if (localStorage.getItem('Jawaban') !== null) {
                let jawaban = JSON.parse(localStorage.getItem('Jawaban'))
                if (Array.isArray(jawaban)) setSelectedOptions(jawaban)
            }
        } catch (e) {
            console.error("Parse jawaban error", e);
            setSelectedOptions([])
        }
    }

    useEffect(() => {
        if (!tipe && !event && !ranting){
            return;
        }
        try {
            setDataEvent(JSON.parse(JSON.parse(decryptId(event))));
            getDataSiswa();
            getDataUjian();
            getJawaban();
        } catch (e) {
            console.error("Invalid event URL params", e);
            router.push('/siswa');
        }
    }, [tipe, ranting, event])    

    useEffect(() => {
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        
        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
            socket.emit('join_event', {
                role: 'siswa',
                event_id: dataSiswa.id_event,
            });
        }
    
        return () => {
            socket.disconnect();
        };
    }, [])

    return (
        <div className={`font-lato bg-darkBlue w-full min-h-screen h-auto flex flex-col items-center`}>
            {/* konten */}
            <div className='w-[90%] my-4'>
                {/* header */}
                <div className='w-full kg:py-3 py-1'>
                    <div className='flex justify-center items-center'>
                        <h1 className='font-lato text-white lg:text-[36px] text-[20px] font-bold text-center uppercase'>UJIAN KELAYAKAN CALON WARGA - {dataEvent.name} - UJI KESHAN</h1>
                    </div>
                    {/* data peserta */}
                    <div className='flex justify-center items-center w-full my-2 space-x-4'>
                        <div className="bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 w-[80%]">
                            <div className='rounded-md col-span-4 bg-[#000510]'>
                                <h1 className='text-center text-white lg:py-2 py-1 font-bold font-lato uppercase tracking-wider lg:text-xl text-[14px]'>{dataSiswa.nomor_urut} - {dataSiswa.name} - {dataSiswa.id_ranting}</h1>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-[#9A4BE9] to-[#16D4FC] rounded-md p-0.5 w-1/5">
                            <div className='rounded-md col-span-2 bg-[#000510]'>
                                <h1 className='text-white text-center lg:py-2 py-1 font-bold font-lato uppercase tracking-wider lg:text-xl text-[14px]'>{minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h1>
                            </div>
                        </div>
                    </div>
                    {/* Sync Status Indicator */}
                    <div className='flex justify-end items-center mb-2'>
                        {syncQueue.length === 0 ? (
                            <div className='flex items-center text-green-400 text-xs font-bold bg-green-900/30 px-2 py-1 rounded-full'>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Cloud Synced
                            </div>
                        ) : (
                            <div className='flex items-center text-yellow-500 text-xs font-bold bg-yellow-900/30 px-2 py-1 rounded-full animate-pulse'>
                                <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                Syncing {syncQueue.length} items...
                            </div>
                        )}
                    </div>
                </div>
                
                {/* container soal & jawaban */}
                <div className='w-full bg-navy rounded-lg lg:my-2 lg:p-3 p-2'>
                    {/* wrapper soal */}
                    <div className='w-full h-auto mb-2'>
                        <p className='text-white lg:text-3xl text-lg font-lato select-none'>{page}. {soal.pertanyaan}</p>
                    </div>
                    {/* wrapper jawaban */}
                    <div className='w-full h-auto mt-7'>
                        <form className='space-y-4'>
                            <div className="radio">
                                <label className='flex items-center'>
                                    <input name={soal.id_soal} className="form-radio mr-4 lg:h-7 lg:w-7 h-5 w-5" type="radio" value="option1" 
                                    checked={
                                        soal.id_soal === (selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.id_soal)
                                        &&
                                        selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.selectedOption === "opsi1"
                                    } 
                                    onChange={() => handleOptionChange(page, soal.id_soal, "opsi1")}/>
                                    <p className='text-white lg:text-2xl text-lg font-lato'>{soal.opsi1}</p>
                                </label>
                            </div>
                            <div className="radio">
                                <label className='flex items-center'>
                                    <input name={soal.id_soal} className="form-radio mr-4 lg:h-7 lg:w-7 h-5 w-5" type="radio" value="option2" 
                                    checked={
                                        soal.id_soal === (selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.id_soal)
                                        &&
                                        selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.selectedOption === "opsi2"
                                    } 
                                    onChange={() => handleOptionChange(page, soal.id_soal, "opsi2")}/>
                                    <p className='text-white lg:text-2xl text-lg font-lato'>{soal.opsi2}</p>
                                </label>
                            </div>
                            <div className="radio">
                                <label className='flex items-center'>
                                    <input name={soal.id_soal} className="form-radio mr-4 lg:h-7 lg:w-7 h-5 w-5" type="radio" value="option3" 
                                    checked={
                                        soal.id_soal === (selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.id_soal)
                                        &&
                                        selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.selectedOption === "opsi3"
                                    }
                                    onChange={() => handleOptionChange(page, soal.id_soal, "opsi3")}/>
                                    <p className='text-white lg:text-2xl text-lg font-lato'>{soal.opsi3}</p>
                                </label>
                            </div>
                            <div className="radio">
                                <label className='flex items-center'>
                                    <input name={soal.id_soal} className="form-radio mr-4 lg:h-7 lg:w-7 h-5 w-5" type="radio" value="option4" 
                                    checked={
                                        soal.id_soal === (selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.id_soal)
                                        &&
                                        selectedOptions?.find(item => {
                                            return item.id_soal === soal.id_soal
                                        })?.selectedOption === "opsi4"
                                    } 
                                    onChange={() => handleOptionChange(page, soal.id_soal, "opsi4")}/>
                                    <p className='text-white lg:text-2xl text-lg font-lato'>{soal.opsi4}</p>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>

                {/* navigation */}
                <Pagination
                    page={page}
                    next={() => nextPage()}
                    answered={[...selectedOptions]}
                    handleSave={() => {
                        if (syncQueue.length > 0) {
                            setShowModalSyncWait(true);
                        } else {
                            setShowModalAlert(true);
                        }
                    }}
                />
            </div>
            <ModalSelesai
            show={showModalSelesai}
            logout={() => handleSave()}
            />

            <ModalAlert
            show={showModalAlert}
            batal={() => setShowModalAlert(false)}
            simpan={() => handleSave()}
            loading={isLoading}
            success={success}
            />

            {showModalSyncWait && (
                <>
                {/* Main modal */}
                <div className="fixed flex justify-center items-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0">
                    <div className="relative w-[90%] h-auto max-w-2xl md:h-auto rounded-lg bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] p-0.5">
                        {/* Modal content */}
                        <div className="relative bg-navy text-white rounded-lg shadow px-10 py-10">
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-xl md:text-2xl font-semibold text-yellow-500 tracking-wide text-center uppercase mb-6">
                                    Masih ada jawaban yang sedang disinkronkan...<br/>Mohon tunggu sebentar.
                                </h1>
                                <div role="status">
                                    <svg aria-hidden="true" className="w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-violet-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <button className="mt-8 font-lato text-white bg-red rounded-lg font-lg px-5 py-2 w-full font-bold uppercase transition hover:opacity-80" onClick={() => setShowModalSyncWait(false)}>Tutup & Lanjutkan Ujian</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-black opacity-80 fixed inset-0 z-40"></div>
                </>
            )}
        </div>
  )
}

export default ujian