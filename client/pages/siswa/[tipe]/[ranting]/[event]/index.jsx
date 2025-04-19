import axios from 'axios'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'
import React, { useEffect, useState } from 'react'
import Modal_siswa from '../../../components/modal_siswa'
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

    const Auth = async (e) => {
        e.preventDefault()
        let form = {
            nomor_urut: nomorUrut,
            id_event: JSON.parse(JSON.parse(decryptId(event))).id,
            id_ranting: router.query.ranting
        }
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
                console.log(router.asPath);
                // router.push('./ujian')
            } else {
                window.alert(res.data.message)
            }
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    const TitleLogin = () => {
        if(!tipe){
            return;
        }
        // console.log(router.query.tipe);
        if (router.query.tipe == 'ukt jambon') {
            return (
                <h1 className='text-xl font-semibold mb-12 uppercase'>Uji Kenaikan Tingkat polos ke jambon <br></br> {dataEvent.name} - ranting {router.query.ranting} <br/> PERSAUDARAAN SETIA HATI <br/> Cabang Trenggalek</h1>
            )
        } else if (router.query.tipe == 'ukt putih'){
            return (
                <h1 className='text-xl font-semibold mb-12 uppercase'>Uji Kenaikan Tingkat jambon ke putih <br></br> {dataEvent.name} - ranting {router.query.ranting} <br/> PERSAUDARAAN SETIA HATI <br/> Cabang Trenggalek</h1>
            )
        } else if (router.query.tipe == 'ukt hijau'){
            return (
                <h1 className='text-xl font-semibold mb-12 uppercase'>Uji Kenaikan Tingkat putih ke hijau <br></br> {dataEvent.name} - ranting {router.query.ranting} <br/> PERSAUDARAAN SETIA HATI <br/> Cabang Trenggalek</h1>
            )
        }
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
                            <TitleLogin/>
                            {/* <h1 className='text-xl font-semibold mb-12 uppercase'>Uji Kelayakan Calon Warga <br></br> Cabang Trenggalek 2023</h1> */}

                            <h1 className='text-lg tracking-wide text-green mb-5'>Masukan Nomor Urut</h1>

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
                                    className='bg-purple py-1.5 w-full rounded-md text-lg font-semibold hover:scale-105 transition ease-in-out duration-300 uppercase'
                                    type='submit'
                                >
                                Verikasi Nama
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* <globalState.Provider value={{ showModalSiswa, setShowModalSiswa}}> */}
            <Modal_siswa 
                    show={showModalSiswa}
                    mulai={() => router.push(router.asPath+`/ujian`)}
                    nama={dataSiswa?.name}
                    ranting={dataSiswa?.id_ranting}
                    close={() => setShowModalSiswa(false)}
                    nilai={dataUktSiswa.keshan}
                />
             {/* </globalState.Provider> */}
        </>
    )
}

export default loginPage