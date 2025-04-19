import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import Pagination from './components/Pagination';
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
import axios from 'axios';
import ModalSelesai from './components/ModalSelesai';
import ModalAlert from './components/ModalAlert';
import SocketIo from 'socket.io-client'
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL
const socket = SocketIo(SOCKET_URL)
const SECRET = process.env.NEXT_PUBLIC_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// import BtnPrevNextImage from '/images/btn_prevnext.webp'

const ujian = () => {

    const router = useRouter()
    const [showModalSelesai, setShowModalSelesai] = useState (false)
    const [showModalAlert, setShowModalAlert] = useState (false)
    const [isLoading, setIsLoading] = useState (false)
    const [success, setSuccess] = useState (false)
    const [dataUjian,setDataUjian] = useState([])
    const [dataEvent,setDataEvent] = useState([])
    const [dataSiswa,setDataSiswa] = useState([])
    const [soal,setSoal] = useState([])
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1);
    const page = searchParams.get('page') ?? '1'

    const tipe = 'ukt_hijau'
    const event = 79
    const ranting = 'trenggalek'
    
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
        const dataSiswa = JSON.parse(localStorage.getItem('dataSiswa'))
        setDataSiswa(dataSiswa)
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

    // create a state variable to store the selected options and id_soal values
    const [selectedOptions, setSelectedOptions] = useState([]);

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
        // console.log(updatedOptions);
        localStorage.setItem('Jawaban', JSON.stringify(updatedOptions))
    }

    const handleSave = () => {
        setIsLoading(true)
        let jawaban
        const dataUktSiswa = JSON.parse(localStorage.getItem('dataUktSiswa'));
        if(localStorage.getItem("Jawaban") !== null){
            jawaban = JSON.parse(localStorage.getItem("Jawaban"))
        }
        let data = {
            id_ukt_siswa: dataUktSiswa.id_ukt_siswa,
            id_session: dataUjian.data.id_session,
            id_siswa: dataSiswa.id_siswa,
            jawaban: jawaban
        }
        axios.post(BASE_URL+'session/koreksi', data)
        .then(res => {
            // console.log(res.data);
            socket.emit('pushRekap')
            setIsLoading(false)
            setSuccess(true)
            setTimeout(() => {
                Logout()
            }, 3000);
        })
        .catch((err)=> {
            console.log(err.message);
        })
    }

    const Logout = () => {
        const dataEvent = event
        localStorage.clear()
        router.push(`/siswa/ukcw/${encryptId(JSON.stringify({id:dataEvent.id,name:dataEvent.name}))}`)
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
                    setShowModalAlert(true)
                    setIsLoading(true)
                    setTimeout(() => {
                        handleSave()
                    }, 2000);
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
    },[seconds, minutes]);

    const getJawaban = async () => {
        if (localStorage.getItem('Jawaban') !== null) {
        let jawaban = JSON.parse(localStorage.getItem('Jawaban'))
        setSelectedOptions(jawaban)
        }
    }

    useEffect(() => {
        if (!tipe && !event && !ranting){
            return;
        }
        setDataEvent(event);
        getDataSiswa();
        getDataUjian();
        getJawaban();
    }, [tipe, ranting, event])        
    

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
                    handleSave={() => setShowModalAlert(true)}
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
        </div>
  )
}

export default ujian