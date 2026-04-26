import axios from 'axios'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'
import React, { useEffect, useState } from 'react'
import Modal_siswa from '../../components/modal_siswa'
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SECRET = process.env.NEXT_PUBLIC_SECRET;


const loginPage = () => {

    const router = useRouter()

    // param value
    const {tipe, event} = router.query

    const [dataEvent,setDataEvent] = useState([])

    const decryptId = (str) => {
        const decodedStr = decodeURIComponent(str);
        return AES.decrypt(decodedStr, SECRET).toString(enc.Utf8);
    }

    useEffect(() => {
      if(!event && !tipe){
        return;
      }
      setDataEvent(JSON.parse(JSON.parse(decryptId(event))));
    }, [event,tipe])
    
    const headerConfig = () =>{
        const token = localStorage.getItem("tokenSiswa")
        let header = {
            headers: {Authorization: `Bearer ${token}`}
        }
        return header
    }

    // const [nis, setNis] = useState();
    const [nomorUrut, setNomorUrut] = useState(0);
    const [dataSiswa, setDataSiswa] = useState()
    const [dataUktSiswa, setDataUktSiswa] = useState([])
    const [showModalSiswa, setShowModalSiswa] = useState (false)
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingMulai, setIsLoadingMulai] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);

    const handleMulai = async () => {
        setIsLoadingMulai(true);
        await router.push(router.asPath + `/ujian`);
    };

    const Auth = async (e) => {
        e.preventDefault()
        setIsLoadingAuth(true);
        let form = {
            nomor_urut: nomorUrut,
            id_event: dataEvent.id
        }
        console.log(form)
        await axios.post(BASE_URL + `siswa/auth`, form)
        .then(async res => {
            if (res.data.logged) {
                let dataSiswa = res.data.data
                let token = res.data.token
                setDataSiswa(res.data.data)
                
                const data = {
                    tipe_ukt: dataSiswa.tipe_ukt,
                    id_siswa: dataSiswa.id_siswa,
                    id_event: dataSiswa.id_event,
                    rayon: dataSiswa.rayon
                }

                // let uktSiswa = []
                await axios.post(BASE_URL + 'session/cek_ukt/'+ dataSiswa.id_siswa, data, headerConfig())
                .then(async res =>{
                    // console.log(res.data.data);
                    localStorage.setItem('dataUktSiswa', JSON.stringify(res.data.data))
                    setDataUktSiswa(res.data.data)
                })
                .catch(err => {
                    console.log(err.message);
                })

                localStorage.setItem('dataSiswa', JSON.stringify(dataSiswa))
                localStorage.setItem('tokenSiswa', (token))
                setShowModalSiswa(true)
                setIsLoadingAuth(false)
                // console.log(router.asPath);
                // router.push('./ujian')
            } else {
                setErrorMessage(res.data.message || "Nomor urut salah atau tidak terdaftar.");
                setShowErrorModal(true);
                setIsLoadingAuth(false)
            }
        })
        .catch(err => {
            console.log(err.message);
            setIsLoadingAuth(false)
        })
    }

    return (
        <>
            <div className="font-lato">

                {/* awal wrapper konten utama */}
                <div className="w-full h-screen">

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-10 py-20">
                        <div className="text-white flex flex-col justify-center items-center text-center">

                            {/* psht icon */}
                            <img className='w-32 mb-4' src="/images/psht-icon.png" alt="" />

                            {/* title */}
                            <h1 className='text-xl font-semibold mb-3 uppercase'>Uji Kelayakan calon warga <br></br>{dataEvent.name}<br/> PERSAUDARAAN SETIA HATI TERATE<br/> Cabang Trenggalek</h1>

                            <h1 className='text-lg tracking-wide text-green mb-3'>Masukan Nomor Urut</h1>

                            {/* wrapper nomor urut */}
                            <form onSubmit={Auth}>
                                <div className="hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 w-full mb-4">
                                    <div className="bg-darkBlue rounded-md p-2 flex items-center gap-x-3">
                                        <svg width="23" height="23" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25 26.25V23.75C25 22.4239 24.4732 21.1521 23.5355 20.2145C22.5979 19.2768 21.3261 18.75 20 18.75H10C8.67392 18.75 7.40215 19.2768 6.46447 20.2145C5.52678 21.1521 5 22.4239 5 23.75V26.25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 13.75C17.7614 13.75 20 11.5114 20 8.75C20 5.98858 17.7614 3.75 15 3.75C12.2386 3.75 10 5.98858 10 8.75C10 11.5114 12.2386 13.75 15 13.75Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <input className='w-full px-2 bg-darkBlue focus:outline-none border-b-2 border-gray focus:border-purple transition ease-in-out duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' placeholder='Nomor Urut' type="number" onChange={(e) => setNomorUrut(e.target.value)} />
                                    </div>
                                </div>

                                <button 
                                    className={`py-1.5 w-full rounded-md text-lg font-semibold hover:scale-105 transition ease-in-out duration-300 uppercase flex justify-center items-center ${isLoadingAuth ? 'bg-purple/70 cursor-not-allowed' : 'bg-purple'}`}
                                    type='submit'
                                    disabled={isLoadingAuth}
                                >
                                {isLoadingAuth ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memverifikasi...
                                    </>
                                ) : (
                                    "Verifikasi Nama"
                                )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* <globalState.Provider value={{ showModalSiswa, setShowModalSiswa}}> */}
                <Modal_siswa 
                    show={showModalSiswa}
                    mulai={handleMulai}
                    loading={isLoadingMulai}
                    nama={dataSiswa?.name}
                    ranting={dataSiswa?.id_ranting}
                    close={() => setShowModalSiswa(false)}
                    nilai={dataUktSiswa.keshan}
                />
             {/* </globalState.Provider> */}

            {/* Error Modal */}
            {showErrorModal && (
                <>
                <div className="fixed flex justify-center items-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0">
                    <div className="relative w-[90%] md:w-1/3 h-auto rounded-lg bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] p-0.5">
                        <div className="relative bg-navy text-white rounded-lg shadow px-10 py-10">
                            <div className="flex flex-col items-center justify-center text-center">
                                <svg className="w-20 h-20 text-[#FF4C4C] mb-4 drop-shadow-[0_0_10px_rgba(255,76,76,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h1 className="text-xl md:text-2xl font-bold text-[#FF4C4C] tracking-wide uppercase mb-4">
                                    Login Gagal
                                </h1>
                                <p className="text-lg md:text-xl font-lato text-gray-300 mb-8">
                                    {errorMessage}
                                </p>
                                <button className="font-lato text-white bg-[#FF4C4C] rounded-lg text-lg px-8 py-2 font-bold uppercase transition hover:scale-105" onClick={() => setShowErrorModal(false)}>Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-black opacity-80 fixed inset-0 z-40"></div>
                </>
            )}
        </>
    )
}

export default loginPage